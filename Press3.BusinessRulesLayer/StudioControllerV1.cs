using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Newtonsoft.Json.Linq;
using Press3.DataAccessLayer;
using System.Web;
using System.IO;
using System.Data;
using Press3.Utilities;
using UDC = Press3.UserDefinedClasses;

namespace Press3.BusinessRulesLayer
{
    public class StudioControllerV1
    {
        string callBackUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["CallBackUrl"].ToString();
        string answerUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["AnswerUrl"].ToString();
        string hangupUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["HangupUrl"].ToString();
        string conferenceCallBackUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["ConferenceCallBackURL"].ToString();
        UDC.HttpParameters httpParameters = new UDC.HttpParameters();
        Helper helper = new Press3.BusinessRulesLayer.Helper();
        public string GetStudioXml(HttpContext context, string connectionString, bool isQueuedCall=false, bool IsCbrCall=false)
        {
            string responseXml = "";
            Int32 accountId = 0;
            DataSet ds = new DataSet();
            JObject responseData = new JObject();
            helper = new Press3.BusinessRulesLayer.Helper();

            
        //    Logger.Info("Connect to Queue GetStudioXml Started is QueuedCall:"+isQueuedCall+",IsCbrCall:"+IsCbrCall);
            try
            {
                Press3.DataAccessLayer.Conference conferenceObj = new Press3.DataAccessLayer.Conference(connectionString);
                Press3.DataAccessLayer.GetStudioXmlV1 getStudioXml = new DataAccessLayer.GetStudioXmlV1(connectionString);
                httpParameters.ParseParameters(context);

                Logger.Info("Incoming call received from:"+httpParameters.FromNumber+",ToNumber:"+httpParameters.ToNumber+",Queued Call:"+isQueuedCall+",Is callBackRequest call:"+IsCbrCall);

                if (string.IsNullOrEmpty(httpParameters.CallStatus) || string.IsNullOrEmpty(httpParameters.ToNumber) || string.IsNullOrEmpty(httpParameters.FromNumber) || string.IsNullOrEmpty(httpParameters.Event))
                {
                    Logger.Debug("Mandatory Parameters are Missing from Connecting to Queue Agent:Callstatus:"+httpParameters.CallStatus+",Tonumber:"+httpParameters.ToNumber+",FromNumber:"+httpParameters.FromNumber+",Event:"+httpParameters.Event);
                    responseXml = "<Response><Hangup data='Mandatory Parameter Missing from connect to agent'/></Response>";
                }
                else
                {
                    if (isQueuedCall){
                        Logger.Info("It is in Queued Call for fetching agent from connect to agent CallUuid:"+httpParameters.CallUUid+",SequenceNUmber:"+httpParameters.SequenceNumber);
                        ds = getStudioXml.GetAgentQueueXml(httpParameters);
                    }
                    else if(IsCbrCall){
                        Logger.Info("It is in  callback request Call  processing cbr Queue CallUuid:"+httpParameters.CallUUid+",SequenceNUmber:"+httpParameters.SequenceNumber);
                        ds = getStudioXml.GetCbrQueueXml(httpParameters);
                    }

                    else { ds = getStudioXml.StudioXml(httpParameters); 
                    }
                        
                    if (ds != null)
                    {
                        helper.ParseDataSet(ds);
                        responseData = helper.GetResponse();
                        responseXml = responseData.SelectToken("ResponseXML").ToString();
                        if (!string.IsNullOrEmpty(Convert.ToString(responseData.SelectToken("AccountId"))))                            
                            accountId = Convert.ToInt32(responseData.SelectToken("AccountId").ToString());
                        Logger.Info("Studio controller: response data before dialing to agent:" + responseData.ToString());
                        if (accountId > 0)
                        {
                            ManagerDashBoardCounts(connectionString, accountId);
                        }
                        if (ds.Tables.Count > 1)
                        {
                            JArray gatewayDetailsObj = (responseData.SelectToken("GatewayDetails") as JArray) as JArray;
                            Gateways gatewaysObj = new Gateways();
                            string postingData = "";
                            JObject restApiResponse = new JObject();
                            string answerXml = "";
                            foreach (JObject j in gatewayDetailsObj)
                            {

                                Logger.Info("GatewayDetails loop in Studio Controller:"+j.ToString());
                                restApiResponse = new JObject();
                                string ringUrl = callBackUrl + "?ChannelName=Agent_" + (j.SelectToken("AgentId")) + "&IsVertoPhone=" + (j.SelectToken("OriginationUrl").ToString().Contains("verto.rtc") ? "true" : "false") + "&IsAgent=true&isTransferToAgent=false&IsRingUrl=true";
                                string digitsMatch = "digitsMatch='" + j.SelectToken("ConferenceDigits")+"'";
                                //Logger.Info("Conference Digits:"+digitsMatch);                                
                                answerXml = "<Response><Conference "+digitsMatch+" stayAlone='true' callbackMethod='GET' callbackUrl='" + callBackUrl + "?ChannelName=Agent_" + (j.SelectToken("AgentId")) + "&#38;IsVertoPhone=" + (j.SelectToken("OriginationUrl").ToString().Contains("verto.rtc") ? "true" : "false") + "&#38;IsAgent=true&#38;isTransferToAgent=false";
                                answerXml += "&#38;GatewayURL=" + j.SelectToken("HttpUrl").ToString() + "' >" + j.SelectToken("Room") + "</Conference></Response>";

                                //postingData = "RingUrl=" + HttpUtility.UrlEncode(ringUrl) + 
                                postingData = "AnswerXml=" + System.Web.HttpUtility.UrlEncode(answerXml) + "&Source=Agent&Priority=H&SequenceNumber=" + j.SelectToken("SequenceNumber") + "&From=";
                               // postingData = "AnswerXml=" + System.Web.HttpUtility.UrlEncode(answerXml) + "&Priority=H&SequenceNumber=" + j.SelectToken("SequenceNumber") + "&From=";
                                postingData += j.SelectToken("Source") + "&To=" + j.SelectToken("Number") + "&OriginateSleep=1&AnswerUrl=" + conferenceCallBackUrl + "&Gateways=";
                                postingData  += j.SelectToken("OriginationUrl") + "&HangupUrl="+ hangupUrl +"&ExtraDialString="+ System.Web.HttpUtility.UrlEncode(j.SelectToken("ExtraDialString").ToString());
                                Logger.Info("call Request Executing to The server : " + j.SelectToken("HttpUrl").ToString() + "posting data " + postingData.ToString());
                               // Logger.Info("httpurl " + j.SelectToken("HttpUrl").ToString());
                                restApiResponse = gatewaysObj.RestApiRequest(postingData, j.SelectToken("HttpUrl").ToString()+"Call/", "POST");
                                if (Convert.ToBoolean(restApiResponse.SelectToken("Success").ToString())) 
                                {
                                    Logger.Debug("Studio call process Call Initiated Response:"+restApiResponse);
                                    var uuid= restApiResponse.SelectToken("RequestUUID").ToString();
                                    var seqNumber = Convert.ToInt32(j.SelectToken("SequenceNumber").ToString());
                                    conferenceObj.UpdateConferenceRequestUUID(uuid, seqNumber);
                                }
                                else
                                {
                                    Logger.Info("Call Request not Success please check Ycom Rest logs for more info payload:"+postingData);
                                    responseXml = "<Response><Hangup data='Issue in connect agent'/></Response>";
                                }
                            }
                           
                        }
                        responseXml = "<Response>" + responseXml + "</Response>";
                    }
                    else
                    {
                        responseXml = "<Response><Speak>No agent available call is getting hangup</Speak><Hangup data='No data return from database'/></Response>";
                    }
                }

            }
            catch (Exception ex)
            {
                Logger.Info("Exception in GetStudio Xml: " + ex.ToString());
                responseXml = string.Format("<Response><Hangup data='server error -->{0} '/></Response>", ex.ToString());
            }
            return responseXml;
        }
       
        public void ManagerDashBoardCounts(string connectionString, Int32 accountId)
        {
            DataSet ds = new DataSet();

            try
            {
                Press3.DataAccessLayer.GetStudioXml managerDashBoardCounts = new DataAccessLayer.GetStudioXml(connectionString);
                ds = managerDashBoardCounts.ManagerDashBoardCounts(accountId);
                if (ds != null)
                {
                    helper.ParseDataSet(ds);
                    dynamic s = helper.GetResponse();
                    JObject countsObject = ((s as JObject).SelectToken("Table") as JArray).First as JObject;
                    countsObject.Add("Channel_Name", "manager_" + accountId.ToString());
                    WebSocketController wsObj = new WebSocketController(connectionString);
                    wsObj.InsertWsNofificationQueue(countsObject.ToString());
                    countsObject.Add(new JProperty("CallEvent", httpParameters.Event));

                    Logger.Debug("Sending data to manager dashBoard with account ID:"+accountId+",With Data:"+countsObject.ToString());
                }

            }catch(Exception e){
                Logger.Error("Exception while inserting ManagerCounts into WebSocket."+e.ToString());
            }

           
        }
        void ParseParameters(HttpContext context)
        {
            

            if (context.Request.HttpMethod.ToString().Equals("GET"))
            {

                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CALL_BACK_REQUEST_AGENT_ID]) == false)
                {
                    httpParameters.CallBackRequestAgentId = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CALL_BACK_REQUEST_AGENT_ID]);
                }
                else
                {
                    httpParameters.CallBackRequestAgentId=0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_VERTO_PHONE]) == false)
                {
                    httpParameters.IsVertoPhone = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_VERTO_PHONE]);
                }
                else
                {
                    httpParameters.IsVertoPhone = false;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CALL_BACK_REQUEST_CLIP]) == false)
                {
                    httpParameters.CallBackRequestClip = context.Request.QueryString[UDC.HttpGetParametersLabels.CALL_BACK_REQUEST_CLIP];
                }
                else
                {
                    httpParameters.CallBackRequestClip = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_CALLBACK_REQUEST_CALL]) == false)
                {
                    httpParameters.IsCallBackRequetCall = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_CALLBACK_REQUEST_CALL]);
                }
                else
                {
                    httpParameters.IsCallBackRequetCall = false;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CALLUUID]) == false)
                {
                    httpParameters.CallUUid = context.Request.QueryString[UDC.HttpGetParametersLabels.CALLUUID];
                }
                else
                {
                    httpParameters.CallUUid = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.TO_NUMBER]) == false)
                {
                    httpParameters.ToNumber = context.Request.QueryString[UDC.HttpGetParametersLabels.TO_NUMBER].ToString();
                }
                else
                {
                    httpParameters.ToNumber = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.EVENT]) == false)
                {
                    httpParameters.Event = context.Request.QueryString[UDC.HttpGetParametersLabels.EVENT];
                }
                else
                {
                    httpParameters.Event = "";
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.EVENT_TIME]) == false)
                {
                    httpParameters.EventTime = HttpUtility.UrlDecode(context.Request.QueryString[UDC.HttpGetParametersLabels.EVENT_TIME]);
                }
                else
                {
                    httpParameters.EventTime = "";
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.FROM_NUMBER]) == false)
                {
                    httpParameters.FromNumber = context.Request.QueryString[UDC.HttpGetParametersLabels.FROM_NUMBER];
                }
                else
                {
                    httpParameters.FromNumber = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_OUTBOUND]) == false)
                {
                    if (context.Request.QueryString[UDC.HttpGetParametersLabels.IS_OUTBOUND].ToString() == "inbound")
                    {
                        httpParameters.IsOutBound = false;
                    }
                    else
                    {
                        httpParameters.IsOutBound = true;
                    }
                }
                else
                {
                    httpParameters.IsOutBound = true;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CALL_STATUS]) == false)
                {
                    httpParameters.CallStatus = context.Request.QueryString[UDC.HttpGetParametersLabels.CALL_STATUS];
                }
                else
                {
                    httpParameters.CallStatus = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.DIGITS]) == false)
                {
                    httpParameters.Digits = context.Request.QueryString[UDC.HttpGetParametersLabels.DIGITS];
                }
                else
                {
                    httpParameters.Digits = "";
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.START_TIME]) == false)
                {
                    httpParameters.StartTime = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.START_TIME].ToString());
                }
                else
                {
                    httpParameters.StartTime = 0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.END_TIME]) == false)
                {
                    httpParameters.EndTime = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.END_TIME].ToString());
                }
                else
                {
                    httpParameters.EndTime = 0;
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.REQUEST_UUID]) == false)
                {
                    httpParameters.RequestUuid = context.Request.QueryString[UDC.HttpGetParametersLabels.REQUEST_UUID];
                }
                else
                {
                    httpParameters.RequestUuid = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.END_REASON]) == false)
                {
                    httpParameters.EndReason = context.Request.QueryString[UDC.HttpGetParametersLabels.END_REASON];
                }
                else
                {
                    httpParameters.EndReason = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.RING_TIME]) == false)
                {
                    httpParameters.RingTIme = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.RING_TIME].ToString());
                }
                else
                {
                    httpParameters.RingTIme = 0;
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.RING_START_TIME]) == false)
                {
                    httpParameters.RingTIme = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.RING_START_TIME].ToString());
                }
                else
                {
                    httpParameters.RingTIme = 0;
                };

                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.HANGUP_DISPOSITION]) == false)
                {
                    httpParameters.HangupDisposition = context.Request.QueryString[UDC.HttpGetParametersLabels.HANGUP_DISPOSITION].ToString();
                }
                else
                {
                    httpParameters.HangupDisposition = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.SEQUENC_ENUMBER]) == false)
                {
                    httpParameters.SequenceNumber = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.SEQUENC_ENUMBER].ToString());
                }
                else
                {
                    httpParameters.SequenceNumber = 0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.DIAL_B_LEG_UUID]) == false)
                {
                    httpParameters.DialBLegUUID = context.Request.QueryString[UDC.HttpGetParametersLabels.DIAL_B_LEG_UUID];
                }
                else
                {
                    httpParameters.DialBLegUUID = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.RECORD_URL]) == false)
                {
                    httpParameters.RecordUrl = context.Request.QueryString[UDC.HttpGetParametersLabels.RECORD_URL];
                }
                else
                {
                    httpParameters.RecordUrl = "";
                };
            }
            else
            {
                string jsonStr = "";
                JObject jsonObj = default(JObject);
                StreamReader inputStream = null;
                JObject jsonObjParaMeters = default(JObject);
                context.Request.InputStream.Position = 0;
                inputStream = new StreamReader(context.Request.InputStream);
                jsonStr = HttpUtility.UrlDecode(inputStream.ReadToEnd());
                jsonObj = new JObject();

                if (!String.IsNullOrEmpty(jsonStr))
                {                
                jsonObj = JObject.Parse(jsonStr);

                jsonObjParaMeters = JObject.Parse(jsonObj.SelectToken("smscresponse").ToString());
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.IS_VERTO_PHONE) != null)
                {
                    httpParameters.IsVertoPhone = Convert.ToBoolean(jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.IS_VERTO_PHONE).ToString());
                }
                else
                {
                    httpParameters.IsVertoPhone = false;
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.IS_CALLBACK_REQUEST_CALL) != null)
                {
                    httpParameters.IsCallBackRequetCall = Convert.ToBoolean(jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.IS_CALLBACK_REQUEST_CALL).ToString());
                }
                else
                {
                    httpParameters.IsCallBackRequetCall = false;
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.CALL_BACK_REQUEST_AGENT_ID) != null)
                {
                    httpParameters.CallBackRequestAgentId = Convert.ToInt32(jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.CALL_BACK_REQUEST_AGENT_ID).ToString());
                }
                else
                {
                    httpParameters.CallBackRequestAgentId = 0;
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.CALL_BACK_REQUEST_CLIP) != null)
                {
                    httpParameters.CallBackRequestClip = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.CALL_BACK_REQUEST_CLIP).ToString();
                }
                else
                {
                    httpParameters.CallBackRequestClip = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.CALLUUID) != null)
                {
                    httpParameters.CallUUid = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.CALLUUID).ToString();
                }
                else
                {
                    httpParameters.CallUUid = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.TO_NUMBER) != null)
                {
                    httpParameters.ToNumber = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.TO_NUMBER).ToString();
                }
                else
                {
                    httpParameters.ToNumber = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.FROM_NUMBER) != null)
                {
                    httpParameters.FromNumber = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.FROM_NUMBER).ToString();
                }
                else
                {
                    httpParameters.FromNumber = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.EVENT) != null)
                {
                    httpParameters.Event = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.EVENT).ToString();
                }
                else
                {
                    httpParameters.Event = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.EVENT_TIME) != null)
                {
                    httpParameters.EventTime = HttpUtility.UrlDecode(jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.EVENT_TIME).ToString());
                }
                else
                {
                    httpParameters.EventTime = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.IS_OUTBOUND) != null)
                {
                    if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.IS_OUTBOUND).ToString() == "inbound")
                    {
                        httpParameters.IsOutBound = false;
                    }
                    else
                    {
                        httpParameters.IsOutBound = true;
                    }

                }
                else
                {
                    httpParameters.IsOutBound = true;
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.CALL_STATUS) != null)
                {
                    httpParameters.CallStatus = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.CALL_STATUS).ToString();
                }
                else
                {
                    httpParameters.CallStatus = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.DIGITS) != null)
                {
                    httpParameters.Digits = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.DIGITS).ToString();
                }
                else
                {
                    httpParameters.Digits = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.END_REASON) != null)
                {
                    httpParameters.EndReason = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.END_REASON).ToString();
                }
                else
                {
                    httpParameters.EndReason = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.START_TIME) != null)
                {
                    httpParameters.StartTime = Convert.ToInt32(jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.START_TIME).ToString());
                }
                else
                {
                    httpParameters.StartTime = 0;
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.END_TIME) != null)
                {
                    httpParameters.EndTime = Convert.ToInt32(jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.END_TIME).ToString());
                }
                else
                {
                    httpParameters.EndTime = 0;
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.RING_TIME) != null)
                {
                    httpParameters.RingTIme = Convert.ToInt32(jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.RING_TIME).ToString());
                }
                else
                {
                    httpParameters.RingTIme = 0;
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.RING_START_TIME) != null)
                {
                    httpParameters.RingTIme = Convert.ToInt32(jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.RING_START_TIME).ToString());
                }
                else
                {
                    httpParameters.RingTIme = 0;
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.HANGUP_DISPOSITION) != null)
                {
                    httpParameters.HangupDisposition = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.HANGUP_DISPOSITION).ToString();
                }
                else
                {
                    httpParameters.HangupDisposition = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.REQUEST_UUID) != null)
                {
                    httpParameters.RequestUuid = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.REQUEST_UUID).ToString();
                }
                else
                {
                    httpParameters.RequestUuid = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.SEQUENCE_NUMBER) != null)
                {
                    httpParameters.SequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.SEQUENCE_NUMBER).ToString());
                }
                else
                {
                    httpParameters.SequenceNumber = 0;
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.DIAL_B_LEG_UUID) != null)
                {
                    httpParameters.DialBLegUUID = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.DIAL_B_LEG_UUID).ToString();
                }
                else
                {
                    httpParameters.DialBLegUUID = "";
                }
                if (jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.RECORD_URL) != null)
                {
                    httpParameters.RecordUrl = jsonObjParaMeters.SelectToken(UDC.HttpPostParametersLabels.RECORD_URL).ToString();
                }
                else
                {
                    httpParameters.RecordUrl = "";
                }
            }
                else
                {
                    Logger.Info("In ParseParameters of StudioController no POST Payload found.");
                }
            };
        }

    }
}
