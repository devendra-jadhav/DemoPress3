using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Data;
using Press3.Utilities;
using UDC = Press3.UserDefinedClasses;
using System.Net;
using System.Web;

namespace Press3.BusinessRulesLayer
{
    public class Calls
    {

        private Helper helper = null;
        public Calls()
        {
            helper = new Helper();
            helper.ResponseFormat = "json";
            helper.InitializeResponseVariables();
        }
        public DataSet DownloadCallHistory(String connection, UDC.CallHistoryDetails callHistoryDetails)
        {
            DataSet ds =new DataSet();
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                ds = callsObject.GetCallHistory(callHistoryDetails);
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return ds;
        }


        public DataSet DownloadTransferAndConferenceCallHistory(String connection, UDC.CallHistoryDetails callHistoryDetails)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                ds = callsObject.GetTransferAndConferenceCalls(callHistoryDetails);
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return ds;
        }








        public DataSet DownloadOutBoundCallHistory(String connection, UDC.CallHistoryDetails callHistoryDetails)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                ds = callsObject.GetOutBoundCallHistory(callHistoryDetails);
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return ds;
        }

        public DataSet DownloadCallBackRequests(string connection, UDC.CallbackRequest cbrObj)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.DataAccessLayer.Calls callsObj = new Press3.DataAccessLayer.Calls(connection);
                ds = callsObj.CallBackRequestManagement(cbrObj);
            }
            catch(Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }

            return ds;
        }

        public JObject GetCallHistory(String connection,UDC.CallHistoryDetails callHistoryDetails)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetCallHistory(callHistoryDetails);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetCallHistorySearchData(String connection, int accountId, int agentId, int roleId, int skillGroupId,string searchfor)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetCallHistorySearchData(accountId, agentId, roleId, skillGroupId, searchfor);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                   helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject TransferCall(String connection, int agentId, int accountId, int callId, int toAgentId,Boolean isWarmTransfer)
        {
            try
            {
                
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.TransferCall(agentId, accountId, callId, toAgentId, isWarmTransfer);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    JObject hangupResponse = new JObject();
                    JObject dialResponse = new JObject();
                    if( ds.Tables[0].Rows.Count > 0 )
                    {
                        if (ds.Tables["OutputParameters"].Rows[0]["Success"].ToString() == "True")
                        {
                            dialResponse = Dial(ds, connection, isWarmTransfer, toAgentId);
                            if(Convert.ToBoolean(dialResponse.SelectToken("Success").ToString()))
                            {
                                //if (ds.Tables[0].Rows[0]["OriginationUrl"].ToString() == "user/")
                               if ((ds.Tables[0].Rows[0]["OriginationUrl"].ToString() !=null) && (!ds.Tables[0].Rows[0]["OriginationUrl"].ToString().Contains("verto")))
                                {
                                    string callType = "";
                                    if (!isWarmTransfer)
                                    {
                                        callType = "2";
                                    }
                                    else
                                    {
                                        callType = "3";
                                    }
                                    Logger.Info("AgentWarmTransferId:" + toAgentId.ToString());
                                    StringBuilder publishData = new StringBuilder();
                                    JObject messageJobj = new JObject(new JProperty("Channel_Name", "Agent_" + toAgentId.ToString()),
                                        new JProperty("CallId", callId),
                                        new JProperty("ConferenceRoom", ds.Tables[0].Rows[0]["ConferenceRoom"].ToString()),
                                        new JProperty("FromNumber", ds.Tables[0].Rows[0]["Source"].ToString()),
                                        new JProperty("IsAgent", false),
                                        new JProperty("CallType", callType),
                                        new JProperty("RequestUUID", ""),
                                        new JProperty("Event", "enter"));
                                    Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connection);
                                    WSCObj.InsertWsNofificationQueue(messageJobj.ToString());
                                    ds.Trace(messageJobj);
                                }
                            }
                        }
                    }
                    helper.ParseDataSet(ds);
                    helper.CreateProperty("ToAgentRequestUUID", dialResponse.SelectToken("RequestUUID").ToString());
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject Dial(DataSet dial,string connection,Boolean isWarmTransfer,int toAgentId)
        {
            JObject responseJobj = new JObject();
            string postData = "", answerXml = "";
            bool isAgenttransfer = true;
            bool isVertoPhone = false;
            string callBackUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["CallBackUrl"].ToString();
            string answerUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["AnswerUrl"].ToString();
            string hangupUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["HangupUrl"].ToString();
            try
            {
                if (isWarmTransfer)
                    isAgenttransfer = false;
                if (dial.Tables[0].Rows[0]["OriginationUrl"].ToString() == "verto.rtc/")
                    isVertoPhone = true;

                Press3.BusinessRulesLayer.Gateways gatewayObj = new Press3.BusinessRulesLayer.Gateways();
                answerXml = "<Response><Conference callbackMethod='GET'  callbackUrl='" + callBackUrl + "?ChannelName=Agent_" + Convert.ToString(toAgentId) + "&#38;IsVertoPhone=" + isVertoPhone.ToString() + "&#38;IsAgent=true&#38;isTransferToAgent=" + isAgenttransfer.ToString() + "&#38;TalkingAgentRequestUUID=";
                answerXml += dial.Tables[0].Rows[0]["TalkingAgentRequestUUID"].ToString() + "&#38;CallerSequenceNumber=" + dial.Tables[0].Rows[0]["CallerSequenceNumber"].ToString();
                answerXml += "&#38;CallerFsMemberId=" + dial.Tables[0].Rows[0]["CallerFsMemberId"].ToString() + "&#38;IsWarmTransfer=" + isWarmTransfer.ToString();
                answerXml += "&#38;GatewayURL=" + dial.Tables[0].Rows[0]["HttpUrl"].ToString() + "' >" + dial.Tables[0].Rows[0]["ConferenceRoom"].ToString() + "</Conference></Response>";
                Logger.Info("answerXml " + answerXml);
                postData = "AnswerXml=" + System.Web.HttpUtility.UrlEncode(answerXml) + "&Prioraty=H&SequenceNumber=" + dial.Tables[0].Rows[0]["SequenceNumber"].ToString() ;
                postData += "&From=" + dial.Tables[0].Rows[0]["Source"].ToString() + "&To=" + dial.Tables[0].Rows[0]["Destination"].ToString();
                postData += "&OriginateSleep=1&AnswerUrl="+answerUrl+"&Gateways=" + dial.Tables[0].Rows[0]["OriginationUrl"].ToString();
                postData += "&HangupUrl=" + hangupUrl + "&ExtraDialString=" + System.Web.HttpUtility.UrlEncode(dial.Tables[0].Rows[0]["ExtraDialString"].ToString());
                Logger.Info("postData " + postData);
                responseJobj = gatewayObj.RestApiRequest(postData, dial.Tables[0].Rows[0]["HttpUrl"].ToString() + "Call/", "POST");
                Logger.Info("responseJobj " + responseJobj);
                if (Convert.ToBoolean(responseJobj.SelectToken("Success").ToString()))
                {
                    var uuid = responseJobj.SelectToken("RequestUUID").ToString();
                    var seqNumber = Convert.ToInt32(dial.Tables[0].Rows[0]["SequenceNumber"].ToString() );
                    Press3.DataAccessLayer.Conference conferenceObj = new Press3.DataAccessLayer.Conference(connection);
                    conferenceObj.UpdateConferenceRequestUUID(uuid, seqNumber);
                }
                else
                {
                    responseJobj = new JObject(new JProperty("Success", false),
                        new JProperty("Message", "Can not transfer call right now"));
                    //responseXml = "<Response><Hangup data='Issue in connect agent'/></Response>";
                }
            }
            catch (Exception ex)
            {
                responseJobj = new JObject(new JProperty("Success", false),
                        new JProperty("Message", "Can not transfer call right now"));
                Logger.Error("Error in Class --> Calls, Method --> Dial, Exception -->" + ex.ToString());
            }

            return responseJobj;
        }


        public JObject ChangeCallStatus(String connection, string status, Int32 agentId,string callId,int accountId,string action, bool isOutbound)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.ChangeCallStatus(status, agentId, callId, accountId, action, isOutbound);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject ChangeCallActions(String connection, int status, int callId, string action, string filePath, string conferenceRoom, bool isOutbound)
        {
            try
            {
                string confRoom = ""; int memberId = 0; string httpURL = "";
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.ChangeCallActions(status, callId, action, conferenceRoom, isOutbound, out confRoom, out memberId, out httpURL);

                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    if (action == "Hold")
                    {
                        if (ds.Tables.Count > 0)
                        {
                            
                            Press3.BusinessRulesLayer.Gateways gatewayObj = new Press3.BusinessRulesLayer.Gateways();
                            string postData = "";
                            if (memberId > 0 && confRoom != "" && httpURL != "")
                            {
                                if (status == 1)
                                {
                                    postData += "ConferenceName=" + confRoom + "&FilePath=" + filePath + "HoldClip.mp3&MemberID=" + memberId + "";
                                    gatewayObj.RestApiRequest(postData,  httpURL + "ConferencePlay/", "POST");
                                }
                                else if (status == 0)
                                {
                                    postData += "ConferenceName=" + confRoom + "&MemberID=" + memberId + "";
                                    gatewayObj.RestApiRequest(postData, httpURL + "ConferenceStopPlay/", "POST");
                                }
                            }
                        }
                    }
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject SubmitACW(String connection, int agentId, int callId,bool isTransfer)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.SubmitACW(agentId, callId, isTransfer);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject CallBackRequestManagement(string connection, UserDefinedClasses.CallbackRequest cbrObj)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.CallBackRequestManagement(cbrObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetCBRSearchRelatedData(string connection, int accountId, int agentId, int roleId)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetCBRSearchRelatedData(accountId, agentId, roleId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject AssignCallBackRequest(string connection, int accountId, int agentId, int toAgentId,int requestId)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.AssignCallBackRequest(accountId, agentId, toAgentId,requestId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject DownloadRecordedClip(string connection, string clipName)
        {
            JObject jObj = new JObject();
            try
            {
                WebClient req = new WebClient();
                HttpResponse response = HttpContext.Current.Response;
                response.Clear();
                response.ClearContent();
                response.ClearHeaders();
                response.Buffer = true;
                string fileName = clipName.Split('/').Last();
                response.AddHeader("Content-Disposition", "attachment;filename=\"" + fileName + "\"");
                response.AddHeader("Content-Type", "audio/mpeg");
                //req.DownloadFile(HttpContext.Current.Server.MapPath("/VoiceClips/" + fileName), fileName);
                //byte[] data = req.DownloadData(HttpContext.Current.Server.MapPath("/VoiceClips/" + clipName));
                byte[] data = req.DownloadData(clipName);
                response.BinaryWrite(data);
                HttpContext.Current.ApplicationInstance.CompleteRequest();
                jObj = new JObject(new JProperty("Success", "True"));
            }
            catch (Exception ex)
            {
                jObj = new JObject(new JProperty("Success", "False"));
                Logger.Error("Exception In DownloadRecordedClip " + ex.ToString());
            }
            return jObj;
        }
        public JObject GetCallIdFromCallUUId(string connection, int accountId, string callUUId)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetCallIdFromCallUUId(accountId, callUUId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In GetCallIdFromCallUUId " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetIvrStudioSelectionDetails(string connection, int accountId, int callId)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetIvrStudioSelectionDetails(accountId, callId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In GetIvrStudioSelectionDetails " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject MakeOutboundCall(string connection, int accountId, int agentId, int customerId, string callUUID, string customerCallUUID, bool isCustomer, string outboundCallBackUrl, int cbrId)
        {
            Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
            Gateways gatewayObj = new Gateways();
            JObject resObj = new JObject();
            try
            {
                DataSet ds = callsObject.MakeOutboundCall(accountId, agentId, customerId, callUUID, customerCallUUID, isCustomer, cbrId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    if (ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0].TableName == "Calls")
                        {
                            if (isCustomer)
                            {
                                string postData = ""; string originationUrl = "";
                                postData += "From=" + ds.Tables[0].Rows[0]["FromNumber"] + "&To=" + ds.Tables[0].Rows[0]["ToNumber"] + "";
                                postData += "&SequenceNumber=" + ds.Tables[0].Rows[0]["CallId"] + "&OriginationUUID=" + ds.Tables[0].Rows[0]["CustomerCallUUID"] + "";
                                postData += "&Gateways=" + ds.Tables[0].Rows[0]["Gateway"] + "&AnswerUrl=" + outboundCallBackUrl + "?IsCustomer=true" + HttpUtility.UrlEncode("&") + "AgentId=" + agentId + "";
                                postData += "&HangupUrl=" + outboundCallBackUrl + "?IsCustomer=true" + HttpUtility.UrlEncode("&") + "AgentId=" + agentId + "";
                                originationUrl += ds.Tables[0].Rows[0]["GatewayURL"];
                                resObj = gatewayObj.RestApiRequest(postData, originationUrl + "Call/", "POST");
                            }
                            else
                            {
                                string postData = ""; string originationUrl = "";
                                postData += "From=" + ds.Tables[0].Rows[0]["FromNumber"] + "&To=" + ds.Tables[0].Rows[0]["ToNumber"] + "";
                                postData += "&SequenceNumber=" + ds.Tables[0].Rows[0]["CallId"] + "&OriginationUUID=" + ds.Tables[0].Rows[0]["CallUUID"] + "";
                                postData += "&Gateways=" + ds.Tables[0].Rows[0]["Gateway"] + "&AnswerUrl=" + outboundCallBackUrl + "?IsCustomer=false" + HttpUtility.UrlEncode("&") + "AgentId=" + agentId + "";
                                postData += "&HangupUrl=" + outboundCallBackUrl + "?IsCustomer=false" + HttpUtility.UrlEncode("&") + "AgentId=" + agentId + ""; ;
                                originationUrl += ds.Tables[0].Rows[0]["GatewayURL"];
                                resObj = gatewayObj.RestApiRequest(postData, originationUrl + "Call/", "POST");
                            }
                            resObj.Add("CallId", ds.Tables[0].Rows[0]["CallId"].ToString());
                        }
                        else
                        {
                            resObj = new JObject(new JProperty("Success", "False"), new JProperty("Message", ds.Tables[0].Rows[0]["Message"]));
                            Logger.Error("Exception In MakeOutboundCall:" + ds.Tables[0].Rows[0]["Message"]);
                        }
                    }
                    else
                    {
                        resObj = new JObject(new JProperty("Success", "False"), new JProperty("Message", "No data returned from database"));
                        Logger.Error("Exception In MakeOutboundCall: No data returned from database");
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In MakeOutboundCall " + ex.ToString());
            }
            return resObj;
        }

        public JObject GetAbandonedcalldetails(String connection, int accountId, string Date, int CallDirection, int CallType, int CallEndStatus, int agentId, int skillGroupId, string fromDate, string toDate, int PageSize, int PageNumber,int StudioId,int sessionAgentId,int roleId)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetAbandonedcalldetails(accountId, Date, CallDirection, CallType, CallEndStatus, agentId, skillGroupId, fromDate, toDate, PageSize, PageNumber, StudioId, sessionAgentId, roleId,0);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public DataSet DownloadCallAbandonedHistory(String connection, int accountId, string Date, int CallDirection, int CallType, int CallEndStatus, int agentId, int skillGroupId, string fromDate, string toDate, int PageSize, int PageNumber,int StudioId,int sessionAgentId,int roleId,int excelDownload)
        {
            DataSet ds = new DataSet();
            try
            {
                

                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                ds = callsObject.GetAbandonedcalldetails(accountId, Date, CallDirection, CallType, CallEndStatus, agentId, skillGroupId, fromDate, toDate, PageSize, PageNumber, StudioId,sessionAgentId, roleId,excelDownload);
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return ds;
        }




        public JObject GetOutBoundCallHistory(String connection, UDC.CallHistoryDetails callHistoryDetails)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetOutBoundCallHistory(callHistoryDetails);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject UpdateCbrstatus(string connection, int agentid, int status, int cbrId)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.UpdateCbrstatus(agentid, status, cbrId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In UpdateCbrstatus " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetUpcomingCBR(string connection, int agentId, string cbrIds,int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetUpcomingCBR(agentId, cbrIds, accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In GetUpcomingCBR " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetCBRreadStatus(string connection, int CbrId, int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetCBRreadStatus(CbrId, accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In GetCBRreadStatus " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetNewCBR(string connection, int CbrId, int agentId, int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetNewCBR(CbrId, agentId,accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In GetNewCBR " + ex.ToString());
            }
            return helper.GetResponse();
        }


        public JObject GetTransferAndConferenceCalls(String connection, UDC.CallHistoryDetails callHistoryDetails)
        {
            try
            {
                Press3.DataAccessLayer.Calls callsObject = new Press3.DataAccessLayer.Calls(connection);
                DataSet ds = callsObject.GetTransferAndConferenceCalls(callHistoryDetails);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }

    }
}
