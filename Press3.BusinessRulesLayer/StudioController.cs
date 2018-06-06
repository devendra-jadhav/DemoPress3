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
    public  class StudioController
    {
        UDC.HttpParameters httpParameters = new UDC.HttpParameters();
        Helper helper = new Press3.BusinessRulesLayer.Helper();
        public string GetStudioXml(HttpContext context,string connectionString)
        {
           string responseXml="";
           Int32 accountId = 0;
           DataSet ds = new DataSet();
           JObject responseData = new JObject();
            try
            {
                Press3.DataAccessLayer.GetStudioXml getStudioXml = new DataAccessLayer.GetStudioXml(connectionString);
                ParseParameters(context);
                if (string.IsNullOrEmpty(httpParameters.CallStatus) || string.IsNullOrEmpty(httpParameters.ToNumber) || string.IsNullOrEmpty(httpParameters.FromNumber) || string.IsNullOrEmpty(httpParameters.Event))
                {
                    responseXml = "<Response><Hahgup data='Mandatary Parameter Missing'/></Response>";
                }
                else
                {
                    ds = getStudioXml.StudioXml(httpParameters);
                    if (ds != null)
                    {
                        helper.ParseDataSet(ds);
                        responseData = helper.GetResponse();
                        responseXml = responseData.SelectToken("ResponseXML").ToString();
                        accountId = Convert.ToInt32(responseData.SelectToken("AccountId").ToString());
                        if (accountId > 0)
                        {
                            ManagerDashBoardCounts(connectionString, accountId,"");
                        }
                        responseXml = "<Response>" + responseXml + "</Response>";
                    }
                }

            }
            catch (Exception ex)
            {
                
                responseXml = string.Format("<Response><Hangup data='server error -->{0} '/></Response>", ex.ToString());
            }
            return responseXml;
        }
        public void ManagerDashBoardCounts(string connectionString, Int32 accountId,string Event)
        {
            DataSet ds = new DataSet();
          
            Press3.DataAccessLayer.GetStudioXml managerDashBoardCounts = new DataAccessLayer.GetStudioXml(connectionString);
            ds = managerDashBoardCounts.ManagerDashBoardCounts(accountId);
            if (ds != null)
            {
                helper.ParseDataSet(ds);
              
                dynamic s = helper.GetResponse();
                JObject countsObject = ((s as JObject).SelectToken("Table") as JArray).First as JObject;
                countsObject.Add(new JProperty("CallEvent", httpParameters.Event));
            }
        }
        public string GetAgentQueueXml(HttpContext context, string connectionString)
        {
            string agentQueueResponseXml = "";
            try
            {
                Press3.DataAccessLayer.GetStudioXml getAgentQueueXml = new DataAccessLayer.GetStudioXml(connectionString);
                ParseParameters(context);

                if (string.IsNullOrEmpty(httpParameters.CallStatus) || string.IsNullOrEmpty(httpParameters.ToNumber) || string.IsNullOrEmpty(httpParameters.FromNumber) || string.IsNullOrEmpty(httpParameters.Event))
                {
                    agentQueueResponseXml = "<Response><Hahgup data='Mandatary Parameter Missing'/></Response>";
                }
                else
                {
                    agentQueueResponseXml = getAgentQueueXml.GetAgentQueueXml(httpParameters);
                }

            }catch(Exception ex){
                agentQueueResponseXml = "<Response><Hangup data='server error'/></Response>";
            }

            return agentQueueResponseXml;
        }

        public string UpdateAgentAnswerState(HttpContext context, string connectionString)
        {
            string dialResponse = "";
            try
            {
                Press3.DataAccessLayer.GetStudioXml getAgentQueueXml = new DataAccessLayer.GetStudioXml(connectionString);
                ParseParameters(context);

                if (string.IsNullOrEmpty(httpParameters.CallStatus) || string.IsNullOrEmpty(httpParameters.ToNumber) || string.IsNullOrEmpty(httpParameters.FromNumber) || string.IsNullOrEmpty(httpParameters.Event))
                {
                    dialResponse = "<Response><Hahgup data='Mandatary Parameter Missing'/></Response>";
                }
                else if (httpParameters.Event.ToUpper() == "DIAL")
                {
                    dialResponse = getAgentQueueXml.UpdateAgentAnswerState(httpParameters);
                }

            }catch(Exception ex){

                dialResponse = "<Response><Hangup data='server error "+ ex.ToString() +"'/></Response>";
            }

            return dialResponse;
        }

        public JObject BsGetCallerIdDetails(HttpContext context, string connectionString)
        {
            JObject responseMetaData = new JObject();
            DataSet ds = new DataSet();
            string answerUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["AnswerUrl"].ToString();
            string hangupUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["HangupUrl"].ToString();
            Press3.DataAccessLayer.GetStudioXml BsgetCallerIdDetails = new DataAccessLayer.GetStudioXml(connectionString);
            ParseParameters(context);
            try
            {
                ds = BsgetCallerIdDetails.GetCallerIdDetails(httpParameters);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {

                    helper.CreateProperty("AnswerUrl", answerUrl);
                    helper.CreateProperty("HangupUrl", hangupUrl);
                    helper.CreateProperty("ActionMethod", "GET");
                    helper.CreateProperty("NotifyCallFlow","false");                    
                    helper.ParseDataSet(ds);
                }
            }
            catch(Exception ex)
            {
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }
            return helper.GetResponse();
        }
        void ParseParameters(HttpContext context)
        {
            
            if (context.Request.HttpMethod.ToString().ToUpper() == "GET")
            {
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[calluid]"]) == false)
                {
                    httpParameters.CallUUid = context.Request.QueryString["smscresponse[calluid]"];
                }
                else
                {
                    httpParameters.CallUUid = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[to]"]) == false)
                {
                    httpParameters.ToNumber = context.Request.QueryString["smscresponse[to]"].ToString();
                }
                else
                {
                    httpParameters.ToNumber = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[event]"]) == false)
                {
                    httpParameters.Event = context.Request.QueryString["smscresponse[event]"];
                }
                else
                {
                    httpParameters.Event = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[from]"]) == false)
                {
                    httpParameters.FromNumber = context.Request.QueryString["smscresponse[from]"];
                }
                else
                {
                    httpParameters.FromNumber = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[direction]"]) == false)
                {
                    if (context.Request.QueryString["smscresponse[direction]"].ToString() == "inbound")
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
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[callstatus]"]) == false)
                {
                    httpParameters.CallStatus = context.Request.QueryString["smscresponse[callstatus]"];
                }
                else
                {
                    httpParameters.CallStatus = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[digits]"]) == false)
                {
                    httpParameters.Digits = context.Request.QueryString["smscresponse[digits]"];
                }
                else
                {
                    httpParameters.Digits = "";
                };

                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[starttime]"]) == false)
                {
                    httpParameters.StartTime = Convert.ToInt32(context.Request.QueryString["smscresponse[starttime]"].ToString());
                }
                else
                {
                    httpParameters.StartTime = 0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[endtime]"]) == false)
                {
                    httpParameters.EndTime = Convert.ToInt32(context.Request.QueryString["smscresponse[endtime]"].ToString());
                }
                else
                {
                    httpParameters.EndTime = 0;
                };


                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[eventtimestamp]"]) == false)
                {
                    httpParameters.EventTime = context.Request.QueryString["smscresponse[eventtimestamp]"].ToString();
                }
                else
                {
                    httpParameters.EventTime = "";
                };


                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[RequestUUID]"]) == false)
                {
                    httpParameters.RequestUuid = context.Request.QueryString["smscresponse[RequestUUID]"];
                }
                else
                {
                    httpParameters.RequestUuid = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[endreason]"]) == false)
                {
                    httpParameters.EndReason = context.Request.QueryString["smscresponse[endreason]"];
                }
                else
                {
                    httpParameters.EndReason = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[ringtime]"]) == false)
                {
                    httpParameters.RingTIme = Convert.ToInt32(context.Request.QueryString["smscresponse[ringtime]"].ToString());
                }
                else
                {
                    httpParameters.RingTIme = 0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[hangupdisposition]"]) == false)
                {
                    httpParameters.HangupDisposition = context.Request.QueryString["smscresponse[hangupdisposition]"].ToString();
                }
                else
                {
                    httpParameters.HangupDisposition = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[SequenceNumber]"]) == false)
                {
                    httpParameters.SequenceNumber = Convert.ToInt32(context.Request.QueryString["smscresponse[SequenceNumber]"].ToString());
                }
                else
                {
                    httpParameters.SequenceNumber = 0;
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[DialBLegUUID]"]) == false)
                {
                    httpParameters.DialBLegUUID = context.Request.QueryString["smscresponse[DialBLegUUID]"];
                }
                else
                {
                    httpParameters.DialBLegUUID = "";
                };
                if (string.IsNullOrEmpty(context.Request.QueryString["smscresponse[recordurl]"]) == false)
                {
                    httpParameters.RecordUrl = context.Request.QueryString["smscresponse[recordurl]"];
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
                jsonStr = inputStream.ReadToEnd();
                jsonObj = new JObject();
                jsonObj = JObject.Parse(jsonStr);
                jsonObjParaMeters = JObject.Parse(jsonObj.SelectToken("smscresponse").ToString());
                if (jsonObjParaMeters.SelectToken("calluid") != null)
                {
                    httpParameters.CallUUid = jsonObjParaMeters.SelectToken("calluid").ToString();
                }
                else
                {
                    httpParameters.CallUUid = "";
                }
                if (jsonObjParaMeters.SelectToken("to") != null)
                {
                    httpParameters.ToNumber = jsonObjParaMeters.SelectToken("to").ToString();
                }
                else
                {
                    httpParameters.ToNumber = "";
                }
                if (jsonObjParaMeters.SelectToken("from") != null)
                {
                    httpParameters.FromNumber = jsonObjParaMeters.SelectToken("from").ToString();
                }
                else
                {
                    httpParameters.FromNumber = "";
                }
                if (jsonObjParaMeters.SelectToken("event") != null)
                {
                    httpParameters.Event = jsonObjParaMeters.SelectToken("event").ToString();
                }
                else
                {
                    httpParameters.Event = "";
                }
                if (jsonObjParaMeters.SelectToken("direction") != null)
                {
                    if (jsonObjParaMeters.SelectToken("direction").ToString() == "inbound")
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
                if (jsonObjParaMeters.SelectToken("callstatus") != null)
                {
                    httpParameters.CallStatus = jsonObjParaMeters.SelectToken("callstatus").ToString();
                }
                else
                {
                    httpParameters.CallStatus = "";
                }
                if (jsonObjParaMeters.SelectToken("digits") != null)
                {
                    httpParameters.Digits = jsonObjParaMeters.SelectToken("digits").ToString();
                }
                else
                {
                    httpParameters.Digits = "";
                }
                if (jsonObjParaMeters.SelectToken("endreason") != null)
                {
                    httpParameters.EndReason = jsonObjParaMeters.SelectToken("digits").ToString();
                }
                else
                {
                    httpParameters.EndReason = "";
                }
                if (jsonObjParaMeters.SelectToken("starttime") != null)
                {
                    httpParameters.StartTime = Convert.ToInt32(jsonObjParaMeters.SelectToken("starttime").ToString());
                }
                else
                {
                    httpParameters.StartTime = 0;
                }
                if (jsonObjParaMeters.SelectToken("endtime") != null)
                {
                    httpParameters.EndTime = Convert.ToInt32(jsonObjParaMeters.SelectToken("endtime").ToString());
                }
                else
                {
                    httpParameters.EndTime = 0;
                }
                if (jsonObjParaMeters.SelectToken("ringtime") != null)
                {
                    httpParameters.RingTIme = Convert.ToInt32(jsonObjParaMeters.SelectToken("ringtime").ToString());
                }
                else
                {
                    httpParameters.RingTIme = 0;
                }
                if (jsonObjParaMeters.SelectToken("hangupdisposition") != null)
                {
                    httpParameters.HangupDisposition = jsonObjParaMeters.SelectToken("hangupdisposition").ToString();
                }
                else
                {
                    httpParameters.HangupDisposition = "";
                }
                if (jsonObjParaMeters.SelectToken("RequestUUID") != null)
                {
                    httpParameters.RequestUuid = jsonObjParaMeters.SelectToken("RequestUUID").ToString();
                }
                else
                {
                    httpParameters.RequestUuid = "";
                }
                if (jsonObjParaMeters.SelectToken("SequenceNumber") != null)
                {
                    httpParameters.SequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken("SequenceNumber").ToString());
                }
                else
                {
                    httpParameters.SequenceNumber = 0;
                }
                if (jsonObjParaMeters.SelectToken("DialBLegUUID") != null)
                {
                    httpParameters.DialBLegUUID = jsonObjParaMeters.SelectToken("DialBLegUUID").ToString();
                }
                else
                {
                    httpParameters.DialBLegUUID = "";
                }
                if (jsonObjParaMeters.SelectToken("recordurl") != null)
                {
                    httpParameters.RecordUrl = jsonObjParaMeters.SelectToken("recordurl").ToString();
                }
                else
                {
                    httpParameters.RecordUrl = "";
                }
            };
        }
    }
}
