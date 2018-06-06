using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.IO;
using UDC = Press3.UserDefinedClasses;
using Newtonsoft.Json.Linq;
using Press3.Utilities;
using System.Data;

namespace Press3.BusinessRulesLayer
{
    public class Conference
    {
        string callBackUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["CallBackUrl"].ToString();
        string answerUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["AnswerUrl"].ToString();
        string hangupUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["HangupUrl"].ToString();
        string conferenceCallBackUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["ConferenceCallBackURL"].ToString();
        UDC.HttpParameters httpParameters = new UDC.HttpParameters();
       
        Helper helper = new Press3.BusinessRulesLayer.Helper();
        private string connectionString;
        public Conference(string connectionString)
        {
            // TODO: Complete member initialization
            this.connectionString = connectionString;
        }
        public bool UpdateConferenceRequestUUID(string requestUUID, Int32 sequenceNumber)
        {
            Press3.DataAccessLayer.Conference confObj = new Press3.DataAccessLayer.Conference(connectionString);
            return confObj.UpdateConferenceRequestUUID(requestUUID, sequenceNumber);
        }
        // Task PublishData(string message)
        //{
        //    WsConfPubSubState wsConfPubSubStateObj = new WsConfPubSubState(httpParameters.ToNumber);
        //     wsConfPubSubStateObj.BroadcastToSubscribers(message);
        //}
        public JObject UpdateConference(HttpContext context, string connectionString)
         {
            JObject resObj = new JObject();
            Gateways gatewaysObj = new Gateways();
            try {
                httpParameters.ParseConferenceParameters(context);
                JObject apiResponseObj = new JObject();
                Press3.DataAccessLayer.Conference confObj = new Press3.DataAccessLayer.Conference(connectionString);

                if (httpParameters.ConferenceAction == "enter" && httpParameters.IsTransferToAgent == true)
                {
                    // Second agent got connected to the call. So hungup the first agent (who initiated the transfer) [Complete transfer case]
                    Logger.Info("Transfer to Agent Request received so Hangup Current Talking Agent --> " + "CallUUID=" + httpParameters.TalkingAgentRequestUUID);
                    apiResponseObj = gatewaysObj.RestApiRequest("CallUUID=" + httpParameters.TalkingAgentRequestUUID, httpParameters.GatewayUrl + "HangupCall/", "POST");
                    if (Convert.ToBoolean(apiResponseObj.SelectToken("Success").ToString()) == false)
                    {
                        //Notify to Agent 
                    }
                }
                else if (httpParameters.ConferenceAction == "enter" && httpParameters.IsWarmTransfer == true)
                {
                    //Agent 1 Tried WarmTransfer with Agent 2. After Agent 2 joined the coneference room we should take the caller from regular room to a private room.
                    Logger.Debug("Conference Warm Transfer requested. ConfernceName:" + httpParameters.ConferenceName);
                    var postData = "ConferenceProfile=ycom&TransferFrom=" + httpParameters.ConferenceName + "&TransferTo=private_" + httpParameters.ConferenceName + "&MemberID=" + httpParameters.CallerFsMemberId;
                    apiResponseObj = gatewaysObj.RestApiRequest(postData, httpParameters.GatewayUrl + "ConferenceTransfer/", "POST");
                    if (Convert.ToBoolean(apiResponseObj.SelectToken("Success").ToString()) == true)
                    {
                        confObj.UpdatePrivateRoomStatus(httpParameters.CallerSequenceNumber, true, 0, true);
                    }
                }
                else if (httpParameters.ConferenceAction == "exit" && httpParameters.IsCaller ==true)
                {
                    Logger.Debug("Caller Disconnected so total Conference Hangup requested: with SequenceNUmber:"+httpParameters.SequenceNumber);
                   
                    // apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "HangupCall/", "POST");
                    apiResponseObj = this.EndConference(0, 0, httpParameters.SequenceNumber, 3);
                    Logger.Info("Total calls hanged up Response:" + apiResponseObj.ToString());

                }
                else if (httpParameters.ConferenceAction == "exit" && httpParameters.ConferenceSize == 0 && !httpParameters.ConferenceName.StartsWith("private"))
                {
                    Logger.Info("exited from coference " + httpParameters.ConferenceName + " , with conference size zero so all conference [private , non-private] hangup,Http URl --> " + httpParameters.GatewayUrl);
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=private_" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("Private conference hangup rest response when conferenceSize:zero," + apiResponseObj.ToString());
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("Non-Private conference hangup rest response when conferenceSize:zero," + apiResponseObj.ToString());
                    //this.EndConference(0, 0, httpParameters.SequenceNumber, 3);
                }
                else if (httpParameters.ConferenceAction == "exit" && httpParameters.ConferenceSize == 1 && httpParameters.IsAgent == false)
                {
                    Logger.Info("exited from conference " + httpParameters.ConferenceName + " , with conference size 1 so all conference [private , non-private] hangup,if agent requested hangup with Http URl --> " + httpParameters.GatewayUrl);
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=private_" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("Private conference hangup rest response when conferenceSize:: 1," + apiResponseObj.ToString());
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("Private conference hangup rest response when conferenceSize:: 1," + apiResponseObj.ToString());
                    //this.EndConference(0, 0, httpParameters.SequenceNumber, 3);
                }

                else if (httpParameters.ConferenceAction == "exit" && httpParameters.IsTransferToAgent == true && httpParameters.ConferenceSize == 1)
                {
                    Logger.Info("Entered into if " + httpParameters.ConferenceName + " Http URl --> " + httpParameters.GatewayUrl);
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=private_" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("Private conference hangup rest response when conferenceSize:1,on agent request is:" + apiResponseObj.ToString());
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("NOn-Private conference hangup rest response when conferenceSize:1,on agent request is :" + apiResponseObj.ToString());
                }
                //else if (!httpParameters.IsVertoPhone && httpParameters.ConferenceAction == "exit" && !httpParameters.IsTransferToAgent && httpParameters.IsAgent && httpParameters.ConferenceSize > 1 && !httpParameters.IsWarmTransfer)
                //{
                //    Logger.Info("Entered into if " + httpParameters.ConferenceName + " Http URl --> " + httpParameters.GatewayUrl);
                //    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=private_" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                //    Logger.Info("Private conference hangup rest response when conferenceSize:1,on agent request is:" + apiResponseObj.ToString());
                //    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                //    Logger.Info("NOn-Private conference hangup rest response when conferenceSize:1,on agent request is :" + apiResponseObj.ToString());
                //}
                else if (!httpParameters.IsVertoPhone && !httpParameters.IsTransferToAgent  && httpParameters.ConferenceSize == 1 && httpParameters.ConferenceAction == "exit" && !httpParameters.IsWarmTransfer)
                {
                    Logger.Info("not verto phone wraup up call " + httpParameters.ConferenceName + ",when conference size is 1 and not warm transfer Http URl --> " + httpParameters.GatewayUrl);
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=private_" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("Private conference hangup rest response when conferenceSize:1,on agent request is:" + apiResponseObj.ToString());
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("NOn-Private conference hangup rest response when conferenceSize:1,on agent request is :" + apiResponseObj.ToString());
                }
                else if (!httpParameters.IsVertoPhone && !httpParameters.IsTransferToAgent && httpParameters.ConferenceSize == 1 && httpParameters.ConferenceAction == "exit" && httpParameters.IsWarmTransfer && httpParameters.IsAgent)
                {
                    Logger.Info("not verto phone wraup up call " + httpParameters.ConferenceName + ",when conference size is 1 and  warm transfer call finished agent Http URl --> " + httpParameters.GatewayUrl);
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=private_" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("Private conference hangup rest response when conferenceSize:1,on agent request is:" + apiResponseObj.ToString());
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("NOn-Private conference hangup rest response when conferenceSize:1,on agent request is :" + apiResponseObj.ToString());
                }
                else if (httpParameters.IsVertoPhone && !httpParameters.IsTransferToAgent && httpParameters.ConferenceSize == 1 && httpParameters.ConferenceAction == "exit" && httpParameters.IsAgent)
                {
                    Logger.Info("*It is a verto phone Wraup call" + httpParameters.ConferenceName + " , with conference size 1 so all conference [private , non-private] hangup,if agent requested hangup with Http URl --> " + httpParameters.GatewayUrl);
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=private_" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("Private conference hangup rest response when conferenceSize:: 1," + apiResponseObj.ToString());
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    Logger.Info("Private conference hangup rest response when conferenceSize:: 1," + apiResponseObj.ToString());
                    //this.EndConference(0, 0, httpParameters.SequenceNumber, 3);
                }

                else if (!httpParameters.IsVertoPhone && !httpParameters.IsTransferToAgent && httpParameters.ConferenceSize >2 && httpParameters.ConferenceAction == "enter" && httpParameters.IsAgent && httpParameters.IpPhoneTransferedMemberId !="0")
                {
                    Logger.Info("*It is a Ipphone transfer Wraup call" + httpParameters.ConferenceName + " , with conference size "+httpParameters.ConferenceSize+" , with Http URl --> " + httpParameters.GatewayUrl);
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=" + httpParameters.IpPhoneTransferedMemberId, httpParameters.GatewayUrl + "ConferenceKick/", "POST");
                    Logger.Info("Conference Kick executed when ip phone transfered hangup response:" + apiResponseObj.ToString());                    
                }



                else if (httpParameters.ConferenceAction =="digits-match" && httpParameters.ConfDigits!=null && httpParameters.IsAgent)
                {
                    string xml = "";
                    string postingData = "";
                    //"From="+httpParameters.FromNumber+"&To="+httpParameters.ConfDigits+"&HangupUrl=http://vendor.360invite.com/hangup.aspx&Priority=H&SequenceNumber="+httpParameters.SequenceNumber+"&AnswerUrl=http://vendor.360invite.com/hangup.aspx&AnswerXml=<Response><conference>test</conference></Response>&Gateways=user/";
                    string answerXml = "";
                    Logger.Info("Conferenece digits matched digits:" + httpParameters.ConfDigits);
                    DataSet digitActionDataset = confObj.ConferenceCallByDirectExtension(httpParameters);
                    helper = new Press3.BusinessRulesLayer.Helper();
                    

                    if (digitActionDataset == null)
                    {
                        helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                    }

                    else
                    {

                        helper.ParseDataSet(digitActionDataset);
                        resObj = helper.GetResponse();

                        Logger.Info("Conference digits matched Response:"+resObj.ToString());

                        if (resObj.SelectToken("Success").ToString() == "False")
                        {
                            xml = resObj.SelectToken("Message").ToString();
                            postingData = "Confrencename="+httpParameters.ConferenceName+"&memberid="+httpParameters.CallerFsMemberId+"&File"+xml;
                            apiResponseObj = gatewaysObj.RestApiRequest(postingData, httpParameters.GatewayUrl + "ConferencePlay/", "POST");

                            Logger.Info("Confernce digits matched: conferenceplay executed with:"+postingData+",Response:"+apiResponseObj.ToString());
                        }
                        else
                        {
                            if (digitActionDataset.Tables.Count > 1)
                            {
                                JArray gatewayDetailsObj = (resObj.SelectToken("GatewayDetails") as JArray) as JArray;
                                foreach (JObject j in gatewayDetailsObj)
                                {

                                    Logger.Info("GatewayDetails loop:" + j.ToString());
                                    string ipphonetransfer = "IpPhoneTransferHangupMember=" + httpParameters.ConferenceMemberID;

                                    string digitsMatch = "digitsMatch='" + j.SelectToken("ConferenceDigits") + "'";
                                    string ringUrl = callBackUrl + "?ChannelName=Agent_" + (j.SelectToken("AgentId")) + "&IsVertoPhone=" + (j.SelectToken("OriginationUrl").ToString().Contains("verto.rtc") ? "true" : "false") + "&IsAgent=true&isTransferToAgent=false&IsRingUrl=true";

                                   // answerXml = "<Response><Conference stayAlone='true' callbackMethod='GET' callbackUrl='" + callBackUrl + "?ChannelName=Agent_" + (j.SelectToken("AgentId")) + "&#38;IsVertoPhone=" + (j.SelectToken("OriginationUrl").ToString().Contains("verto.rtc") ? "true" : "false") + "&#38;IsAgent=true&#38;isTransferToAgent=false&#38;" + ipphonetransfer;
                                    answerXml = "<Response><Conference " + digitsMatch + " stayAlone='true' callbackMethod='GET' callbackUrl='" + callBackUrl + "?ChannelName=Agent_" + (j.SelectToken("AgentId")) + "&#38;IsVertoPhone=" + (j.SelectToken("OriginationUrl").ToString().Contains("verto.rtc") ? "true" : "false") + "&#38;IsAgent=true&#38;isTransferToAgent=false&#38;" + ipphonetransfer;
                                    answerXml += "&#38;GatewayURL=" + j.SelectToken("HttpUrl").ToString() + "' >" + j.SelectToken("Room") + "</Conference></Response>";

                                    postingData = "RingUrl=" + HttpUtility.UrlEncode(ringUrl) + "&AnswerXml=" + System.Web.HttpUtility.UrlEncode(answerXml) + "&Priority=H&SequenceNumber=" + j.SelectToken("SequenceNumber") + "&From=";
                                    // postingData = "AnswerXml=" + System.Web.HttpUtility.UrlEncode(answerXml) + "&Priority=H&SequenceNumber=" + j.SelectToken("SequenceNumber") + "&From=";
                                    postingData += j.SelectToken("Source") + "&To=" + j.SelectToken("Number") + "&Source=Agent&OriginateSleep=1&AnswerUrl=" + conferenceCallBackUrl + "&Gateways=";
                                    postingData += j.SelectToken("OriginationUrl") + "&HangupUrl=" + hangupUrl + "&ExtraDialString=" + System.Web.HttpUtility.UrlEncode(j.SelectToken("ExtraDialString").ToString());
                                    Logger.Info("call Request Executing to The server after conference digits matched : " + j.SelectToken("HttpUrl").ToString() + "posting data " + postingData.ToString());
                                    // Logger.Info("httpurl " + j.SelectToken("HttpUrl").ToString());
                                    apiResponseObj = gatewaysObj.RestApiRequest(postingData, j.SelectToken("HttpUrl").ToString() + "Call/", "POST");
                                    if (Convert.ToBoolean(apiResponseObj.SelectToken("Success").ToString()))
                                    {
                                        Logger.Debug("Call Initiated Response in digits matched:" + apiResponseObj);
                                        var uuid = apiResponseObj.SelectToken("RequestUUID").ToString();
                                        var seqNumber = Convert.ToInt32(j.SelectToken("SequenceNumber").ToString());
                                        confObj.UpdateConferenceRequestUUID(uuid, seqNumber);
                                    }
                                    else
                                    {
                                        Logger.Info("Call Request not Success please check Ycom Rest logs for more info payload in conf digits:" + postingData);
                                        //responseXml = "<Response><Hangup data='Issue in connect agent'/></Response>";
                                    }
                                }

                            }
                        }
                    }                                       

                }
                
                DataSet ds = confObj.UpdateConference(httpParameters);
                helper = new Press3.BusinessRulesLayer.Helper();
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                      helper.ParseDataSet(ds);
                    resObj = helper.GetResponse();
                    
                   Logger.Info("Update conference requested and return data is:"+resObj.ToString());
                    
                }





                string callType = "";
                if (httpParameters.IsAgent)
                {
                    callType = "1";
                }
                if (httpParameters.IsTransferToAgent)
                {
                    callType = "2";
                }
                if (httpParameters.IsWarmTransfer)
                {
                    callType = "3";
                }
                if (httpParameters.ConferenceSize > 2 && !httpParameters.IsTransferToAgent)
                {
                    callType = "4";
                }

                if (!String.IsNullOrEmpty(httpParameters.IpPhoneTransferedMemberId) && !httpParameters.IsTransferToAgent && !httpParameters.IsWarmTransfer)
                {
                    callType = "2";
                    Logger.Info("calltype setting: 2 conference action:" + httpParameters.ConferenceAction + ",iswarm transfer" + httpParameters.IsWarmTransfer + ",isagent:" + httpParameters.IsAgent + ",AgentChannel:" + httpParameters.ChannelName + ",IPPhonetransfer memberid:" + httpParameters.IpPhoneTransferedMemberId);
                }






                //string callType = "";
                //if (httpParameters.IsAgent)
                //{
                //    callType = "1";
                //}
                // if (httpParameters.IsTransferToAgent)
                //{
                //    callType = "2";
                //}             
                // if (httpParameters.IsWarmTransfer)
                //{
                //    callType = "3";
                //    Logger.Info("call type 3 setting:conference action:" + httpParameters.ConferenceAction + ",iswarm transfer" + httpParameters.IsWarmTransfer + ",isagent:" + httpParameters.IsAgent + ",AgentChannel:" + httpParameters.ChannelName + ",IPPhonetransfer memberid:" + httpParameters.IpPhoneTransferedMemberId);
                //}
                // if (!String.IsNullOrEmpty(httpParameters.IpPhoneTransferedMemberId) && !httpParameters.IsTransferToAgent && !httpParameters.IsWarmTransfer)
                // {
                //     callType = "2";
                //     Logger.Info("calltype setting: 2 conference action:" + httpParameters.ConferenceAction + ",iswarm transfer" + httpParameters.IsWarmTransfer + ",isagent:" + httpParameters.IsAgent + ",AgentChannel:" + httpParameters.ChannelName + ",IPPhonetransfer memberid:" + httpParameters.IpPhoneTransferedMemberId);
                // }
                // if (httpParameters.ConferenceSize > 2 && !httpParameters.IsTransferToAgent && String.IsNullOrEmpty(httpParameters.IpPhoneTransferedMemberId) && !httpParameters.IsWarmTransfer && callType !="3")
                // {
                //     callType = "4";
                //     Logger.Info("call type 4 setting:conference action:" + httpParameters.ConferenceAction + ",iswarm transfer" + httpParameters.IsWarmTransfer + ",isagent:" + httpParameters.IsAgent + ",AgentChannel:" + httpParameters.ChannelName + ",IPPhonetransfer memberid:" + httpParameters.IpPhoneTransferedMemberId);
                // }
                



                 if (httpParameters.IsRingUrl && httpParameters.IpPhoneTransferedMemberId == "0")
                {
                    JObject messageJobj = new JObject(new JProperty("Channel_Name", httpParameters.ChannelName),
                        new JProperty("CallId", httpParameters.SequenceNumber.ToString()),
                        new JProperty("FromNumber", httpParameters.FromNumber),
                        new JProperty("IsAgent", httpParameters.IsAgent),
                        new JProperty("CallType", "4"),
                        new JProperty("RequestUUID", httpParameters.RequestUuid),
                        new JProperty("Event", httpParameters.ConferenceAction));
                    Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connectionString);                    
                    WSCObj.InsertWsNofificationQueue(messageJobj.ToString());
                    httpParameters.Trace(messageJobj);
                    Logger.Info("WebSocket IsRingUrl");
                }

                if (!httpParameters.IsVertoPhone && httpParameters.Event == "conference" && httpParameters.IsTransferToAgent)
                {
                    JObject messageJobj = new JObject(new JProperty("Channel_Name", httpParameters.ChannelName),
                        new JProperty("CallId", httpParameters.SequenceNumber.ToString()),
                        new JProperty("ConferenceRoom", httpParameters.ConferenceName),
                        new JProperty("FromNumber", httpParameters.FromNumber),
                        new JProperty("IsAgent", true),
                        new JProperty("CallType", callType),
                        new JProperty("RequestUUID", httpParameters.RequestUuid),
                        new JProperty("Event", httpParameters.ConferenceAction));
                    Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connectionString);                    
                    WSCObj.InsertWsNofificationQueue(messageJobj.ToString());
                    httpParameters.Trace(messageJobj);
                    Logger.Info("WebSocket IsTransferToAgent");

                }

                if (!httpParameters.IsVertoPhone && httpParameters.Event =="conference" && httpParameters.IsAgent)
                {
                    Logger.Info("Conference size:" + httpParameters.ConferenceSize + "Agent conference event:" + httpParameters.ConferenceAction);
                    StringBuilder publishData = new StringBuilder();
                    JObject messageJobj = new JObject(new JProperty("Channel_Name", httpParameters.ChannelName),
                        new JProperty("CallId", httpParameters.SequenceNumber.ToString()),
                        new JProperty("ConferenceRoom", httpParameters.ConferenceName),
                        new JProperty("FromNumber", httpParameters.FromNumber),
                        new JProperty("IsAgent", true),
                        new JProperty("CallType", callType),
                        new JProperty("RequestUUID", httpParameters.RequestUuid),
                        new JProperty("Event", httpParameters.ConferenceAction));
                    Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connectionString);                    
                    WSCObj.InsertWsNofificationQueue(messageJobj.ToString());
                    httpParameters.Trace(messageJobj);
                    Logger.Info("WebSocket IsAgent");
                    Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                    int accountId = 0;
                    accountId = managerObj.GetAccountId(connectionString, Convert.ToInt32(httpParameters.SequenceNumber.ToString()));
                    if (accountId > 0)
                    {
                       Press3.BusinessRulesLayer.StudioControllerV1 studioControllerObj = new Press3.BusinessRulesLayer.StudioControllerV1();
                       studioControllerObj.ManagerDashBoardCounts(connectionString, accountId);
                    }
                }


                if (!httpParameters.IsVertoPhone && httpParameters.Event == "conference" && !httpParameters.IsAgent && !httpParameters.ConferenceName.StartsWith("private") )
                {
                    bool isPrivateVisited = false;
                    if (resObj.SelectToken("IsPrivateVisited") != null && bool.TryParse(resObj.SelectToken("IsPrivateVisited").ToString(), out isPrivateVisited) && !isPrivateVisited)
                  {
                      StringBuilder publishData = new StringBuilder();
                      JObject messageJobj = new JObject(new JProperty("Channel_Name", httpParameters.ChannelName),
                          new JProperty("CallId", httpParameters.SequenceNumber.ToString()),
                          new JProperty("IsAgent", false),
                          new JProperty("ConferenceRoom", httpParameters.ConferenceName),
                          new JProperty("FromNumber", httpParameters.FromNumber),
                          new JProperty("CallType", callType),
                          new JProperty("RequestUUID", httpParameters.RequestUuid),
                          new JProperty("Event", callType.Equals("4")? "conference" : httpParameters.ConferenceAction));
                      Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connectionString);                      
                      WSCObj.InsertWsNofificationQueue(messageJobj.ToString());
                      httpParameters.Trace(messageJobj);
                      Logger.Info("WebSocket IsNotAgent");
                      Logger.Info("In Confernce Event not an agent:" + String.Format(callType.Equals("4") ? "conference" : httpParameters.ConferenceAction )+ ",Calltype:" + callType + ",Requestuid:" + httpParameters.RequestUuid + ",channelname:" + httpParameters.ChannelName);
                  }
                  else
                  {
                      Logger.Info(string.Format("IsPrivateVisited Else Block. {0}", resObj));
                  }
                }
 

                //if (Convert.ToInt16(resObj.SelectToken("ConfMembersCount").ToString())>0)
                //{
                //    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=private_" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                //    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                //}
                if (httpParameters.ConferenceAction == "exit" && httpParameters.ConferenceSize == 1 && Convert.ToBoolean(resObj.SelectToken("IsActiveAgent").ToString()))
                {
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=private_" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + httpParameters.ConferenceName + "&MemberID=all", httpParameters.GatewayUrl + "ConferenceHangup/", "POST");
                }
                if (!string.IsNullOrEmpty(Convert.ToString(context.Request["CallEvent"])))
                {
                    if (Convert.ToString(context.Request["CallEvent"]) == "WhisperStart" && httpParameters.ConferenceAction =="enter")
                    {
                        apiResponseObj = gatewaysObj.RestApiRequest("TheseMemberIDs=" + httpParameters.ConferenceMemberID.ToString() + "&ThoseMemberIDs=" + Convert.ToString(context.Request["CallerFsMemberId"]) + "&Relationship=nospeak&ConferenceName=" + httpParameters.ConferenceName, httpParameters.GatewayUrl + "ConferenceRelate/", "POST");
                        Logger.Info("apiResponseObj--> Preameters" + "TheseMemberIDs=" + httpParameters.ConferenceMemberID.ToString() + "&ThoseMemberIDs=" + Convert.ToString(context.Request["CallerFsMemberId"]) + "&Relationship=nospeak&ConferenceName=" + httpParameters.ConferenceName);
                        Logger.Info("apiResponseObj-->" + apiResponseObj.ToString());
                        if (!Convert.ToBoolean(Convert.ToString(apiResponseObj.SelectToken("Success"))))
                        {
                            gatewaysObj.RestApiRequest("RequestUUID=" + httpParameters.RecordUrl, httpParameters.GatewayUrl + "HangupCall/", "POST");
                        }
                        
                    }
                }
            }
            catch(Exception ex){
                Logger.Error("Exception In BAL.UpdateConference " + ex.ToString());
                resObj.RemoveAll();
                resObj.Add(new JProperty("Success", false));
                resObj.Add(new JProperty("Message", ex.ToString()));
            }
            return resObj;
        }

        public JObject CheckCompleteTransfer(HttpContext context)
        {
            JObject checkCompleteTransfer = new JObject();
            string conferenceRoom = context.Request["ConferenceName"].ToString();
            string Conferencememberid = context.Request["CallId"].ToString();
            string talkingAgentRequestID = context.Request["TalkingAgentRequestUUID"].ToString();

            Press3.DataAccessLayer.Conference confObj = new Press3.DataAccessLayer.Conference(connectionString);
            var ds = confObj.CheckCompleTransfer(Conferencememberid,conferenceRoom,talkingAgentRequestID);
            helper = new Press3.BusinessRulesLayer.Helper();
            if (ds == null)
            {
                helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database in check completetransfer");
                helper.CreateProperty(UDC.Label.SUCCESS, false);
            }
            else
            {
                helper.ParseDataSet(ds);
                checkCompleteTransfer = helper.GetResponse();
                Logger.Info("Response in Checkcomplete warm transfer is done Response:" + checkCompleteTransfer.ToString());
            }

            return checkCompleteTransfer;

        }

        
        public JObject CompleteTransfer(HttpContext context)
        {
            JObject responseJobj = new JObject();
            JObject hangupResponseJobj = new JObject();
            JObject changeConferenceRoomResponseJobj = new JObject();
            JObject conferenceJobj = new JObject();
            helper = new Press3.BusinessRulesLayer.Helper();
            try
            {
                changeConferenceRoomResponseJobj = ChangeConferenceRoom(context);
                if(Convert.ToBoolean(Convert.ToString(changeConferenceRoomResponseJobj.SelectToken("Success"))) == true)
                {
                    hangupResponseJobj = HangUp(context);
                    string conferenceRoom = context.Request["ConferenceName"].ToString();
                    string CallId = context.Request["CallId"].ToString();
                    conferenceJobj.Add(new JProperty("CallType","3"));

                    JObject messageJobj = new JObject(new JProperty("Channel_Name", conferenceRoom+"_"+CallId),
                        new JProperty("CallType", "3"),
                        new JProperty("Event", "Conference"));
                    Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connectionString);
                    
                    WSCObj.InsertWsNofificationQueue(messageJobj.ToString());

                    
                    if (Convert.ToBoolean(Convert.ToString(hangupResponseJobj.SelectToken("Success"))) == true)
                    {
                        helper.CreateProperty("Success", "True");
                        helper.CreateProperty("Message", "Success");
                    }
                    else
                    {
                        helper.CreateProperty("Success", "False");
                        helper.CreateProperty("Message", "CompleteTransfer Not Done At this movement");
                    }
                    
                }
                else
                {
                    helper.CreateProperty("Success", "False");
                    helper.CreateProperty("Message", "CompleteTransfer Not Done At this movement");
                }
                
                
            }
            catch(Exception ex)
            {                
                helper.CreateProperty("Success", "False");
                helper.CreateProperty("Message", "CompleteTransfer Not Done At this movement");
                Logger.Info("Exception in CompleteTransfer " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject HangUp(HttpContext context)
        {
            JObject apiResponseObj = new JObject();
            try
            {
                Gateways gatewaysObj = new Gateways();
                if (context.Request["isOutbound"] == "1")
                {
                    string conferenceRoom = ""; string gatewayURL = "";
                    Press3.DataAccessLayer.OutboundCall outboundCallObj = new Press3.DataAccessLayer.OutboundCall(connectionString);
                    DataSet ds = outboundCallObj.GetAgentConferenceRoom(Convert.ToInt32(context.Request["callId"]));
                    if (ds == null)
                    {
                        helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                    }
                    else
                    {
                        if (ds.Tables.Count > 0)
                        {
                            if (Convert.ToBoolean(ds.Tables[0].Rows[0]["Success"]))
                            {
                                gatewayURL = ds.Tables[0].Rows[0]["GatewayURL"].ToString();
                                conferenceRoom = ds.Tables[0].Rows[0]["ConferenceRoom"].ToString();
                            }
                        }
                    }
                    if (conferenceRoom != "")
                    {
                        Logger.Info("Hangup Conference --> CallId=" + context.Request["callId"] + "conferenceRoom=" + conferenceRoom + " GatewayURL " + gatewayURL);
                        apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + conferenceRoom + "&MemberID=all", gatewayURL + "ConferenceHangup/", "POST");
                    }
                }
                else
                {
                    Logger.Info("Hangup Current Talking Agent --> " + "CallUUID=" + context.Request["TalkingAgentRequestUUID"].ToString() + " GatewayURL " + context.Request["HttpURL"].ToString());
                    apiResponseObj = gatewaysObj.RestApiRequest("CallUUID=" + context.Request["TalkingAgentRequestUUID"].ToString(), context.Request["HttpURL"].ToString() + "HangupCall/", "POST");
                }
            }
            catch (Exception ex)
            {
                apiResponseObj = new JObject(new JProperty("Success", false),
                    new JProperty("Message", ex.ToString()));
                Logger.Info("Exception in HangUp " + ex.ToString());
            }

            return apiResponseObj;
        }
        public JObject Whisper(string theseMemberId,string thoseMemberId,string relationship,string conferenceRoom,string httpUrl)
        {
            JObject apiResponseObj = new JObject();
            try
            {
                Gateways gatewaysObj = new Gateways();
                apiResponseObj = gatewaysObj.RestApiRequest("TheseMemberIDs=" + theseMemberId + "&ThoseMemberIDs=" + thoseMemberId + "&Relationship =" + relationship + "&ConferenceName =" + conferenceRoom, httpUrl + "ConferenceRelate/", "POST");
            }
            catch (Exception ex)
            {
                apiResponseObj = new JObject(new JProperty("Success", false),
                    new JProperty("Message", ex.ToString()));
                Logger.Info("Exception in HangUp " + ex.ToString());
            }

            return apiResponseObj;
        }
        public JObject ChangeConferenceRoom(HttpContext context)
        {
            JObject apiResponseObj = new JObject();
            string conferenceRoom = "";
            bool isPrivate = Convert.ToBoolean(context.Request["IsPrivate"].ToString());
            var postData = "";
            try
            {
                isPrivate = Convert.ToBoolean(context.Request["IsPrivate"].ToString());
                conferenceRoom = context.Request["ConferenceName"].ToString();
                Logger.Info("conferenceRoom " + conferenceRoom + "HttpUrl" + context.Request["HttpURL"].ToString() + " CallerSequenceNumber  " + context.Request["CallerSequenceNumber"].ToString());
               
                
                if(isPrivate)
                {
                    postData = "ConferenceProfile=ycom&TransferFrom=" + context.Request["ConferenceName"].ToString() + "&TransferTo=private_" + conferenceRoom + "&MemberID=" + context.Request["CallerFsMemberId"].ToString();
                }
                else
                {
                    postData = "ConferenceProfile=ycom&TransferFrom=private_" + context.Request["ConferenceName"].ToString() + "&TransferTo=" + conferenceRoom + "&MemberID=" + context.Request["CallerFsMemberId"].ToString();
                }
                Logger.Info("Post data " + postData.ToString());
                Press3.DataAccessLayer.Conference confObj = new Press3.DataAccessLayer.Conference(connectionString);
                Gateways gatewaysObj = new Gateways();
                apiResponseObj = gatewaysObj.RestApiRequest(postData, context.Request["HttpURL"].ToString() + "ConferenceTransfer/", "POST");
                Logger.Info("apiResponseObj " + apiResponseObj.ToString());
                if (Convert.ToBoolean(apiResponseObj.SelectToken("Success").ToString()) == true)
                {
                    confObj.UpdatePrivateRoomStatus(Convert.ToInt32(context.Request["CallerSequenceNumber"]), isPrivate,Convert.ToInt32(context.Request["CallId"]));
                }
            }
            catch(Exception ex)
            {
                Logger.Info("Exception in ChangeConferenceRoom " + ex.ToString());
                apiResponseObj = new JObject(new JProperty("Success", false),
                    new JProperty("Message", ex.ToString()));
            }

            return apiResponseObj;
        }
        public JObject CancelWarmTransfer(HttpContext context)
        {
            JObject responseJobj = new JObject();
            try
            {
                Logger.Info("callerSeqNo:" + context.Request["CallerSequenceNumber"] == null ? "null": context.Request["CallerSequenceNumber"]); 
                DataSet responseDs = new DataSet();
                Press3.DataAccessLayer.Conference conferenceObject = new Press3.DataAccessLayer.Conference(connectionString);
                responseDs = conferenceObject.GetCallerConferenceRoomdetails(Convert.ToInt32(context.Request["CallerSequenceNumber"]));
                
                if (responseDs == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    Logger.Info("Room Type" + responseDs.Tables[0].Rows[0]["RoomType"].ToString());
                    if (Convert.ToInt32(responseDs.Tables[0].Rows[0]["RoomType"]) == 1)
                    {
                        responseJobj = ChangeConferenceRoom(context);
                    }
                    responseJobj = HangUp(context);
                    helper.ParseDataSet(responseDs);
                }
                
            }
            catch(Exception ex)
            {
                Logger.Info("Exception in Conference BLL " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject ConferenceDial(DataSet ds, string callEvent,int toAgentId)
        {
            JObject responseObj = new JObject();
            helper = new Press3.BusinessRulesLayer.Helper();
            try
            {
                Press3.DataAccessLayer.Conference confObj = new Press3.DataAccessLayer.Conference(connectionString);
                Gateways gatewaysObj = new Gateways();
                string postingData = "";
                JObject restApiResponse = new JObject();
                string answerXml = "";
                bool isVertoPhone = false;

                if (ds.Tables[0].Rows[0]["OriginationUrl"].ToString() == "verto.rtc/")
                    isVertoPhone = true;

                foreach (DataRow _row in ds.Tables[0].Rows)
                {
                    
                    restApiResponse = new JObject();
                    answerXml = "<Response><Conference muted='" + _row["IsMute"].ToString().ToLower() + "' callbackMethod='GET' callbackUrl='" + callBackUrl + "?ChannelName=Agent_" + Convert.ToString(toAgentId) + "&#38;IsVertoPhone=" + isVertoPhone.ToString() + "&#38;CallEvent=" + callEvent.Replace(" ", "") + "&#38;CallerFsMemberId=" + _row["CallerFsMemberId"].ToString() + "&#38;GatewayUrl=" + _row["HttpUrl"].ToString() + "' >" + _row["ConferenceRoom"].ToString() + "</Conference></Response>";
                    postingData = "AnswerXml=" + System.Web.HttpUtility.UrlEncode(answerXml) + "&Prioraty=H&SequenceNumber=" + _row["SequenceNumber"].ToString() + "&From=";
                    postingData += _row["Source"].ToString()  + "&To=" + _row["Destination"].ToString()  + "&OriginateSleep=1&AnswerUrl=local.press3.com/ConferenceController.ashx&Gateways=";
                    postingData += _row["OriginationUrl"].ToString()  + "&HangupUrl=" + hangupUrl + "&ExtraDialString=" + System.Web.HttpUtility.UrlEncode(_row["ExtraDialString"].ToString());
                    restApiResponse = gatewaysObj.RestApiRequest(postingData, _row["HttpUrl"].ToString() + "Call/", "POST");

                    if (Convert.ToBoolean(restApiResponse.SelectToken("Success").ToString()))
                    {
                        var uuid = restApiResponse.SelectToken("RequestUUID").ToString();
                        var seqNumber = Convert.ToInt32(_row["SequenceNumber"].ToString());
                        //update request uuid
                        confObj.UpdateConferenceRequestUUID(uuid, seqNumber);
                        helper.CreateProperty("Success", true);
                        helper.CreateProperty("RequestUUID", uuid);
                        helper.CreateProperty("Message", "ok");
                    }
                    else
                    {
                        helper.CreateProperty("Success", false);
                        helper.CreateProperty("Message", restApiResponse.SelectToken("Message").ToString());
                    }
                   
                }

                
                                
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("Error in BUsiness Conference class, Method ConferenceDial Exception --> {0}",ex.ToString()));
                helper.CreateProperty("Success", false);
                helper.CreateProperty("Message", "Something Went Wrong");
            }
            return helper.GetResponse();
        }
        public JObject ConferenceMuteUnMute(HttpContext context)
        {
            helper = new Press3.BusinessRulesLayer.Helper();
            JObject apiResponseObj = new JObject();
            try
            {
                Gateways gatewaysObj = new Gateways();
                if (Convert.ToBoolean(Convert.ToString(context.Request["IsMute"])))
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + context.Request["ConferenceRoom"] + "&MemberID=" + context.Request["FsMemberId"], context.Request["HttpUrl"] + "ConferenceMute/", "POST");
                else
                    apiResponseObj = gatewaysObj.RestApiRequest("ConferenceName=" + context.Request["ConferenceRoom"] + "&MemberID=" + context.Request["FsMemberId"], context.Request["HttpUrl"] + "ConferenceUnmute/", "POST");
                Press3.DataAccessLayer.Conference confObj = new Press3.DataAccessLayer.Conference(connectionString);
                
                if (Convert.ToBoolean(Convert.ToString(apiResponseObj.SelectToken("Success"))))
                {
                    confObj.UpdateConferenceMuteUnMute(Convert.ToInt32(context.Request["SequenceNumber"]), Convert.ToBoolean(context.Request["IsMute"]));
                    helper.CreateProperty("Success", true);
                    helper.CreateProperty("Message", "ok");
                }
                else
                {
                    helper.CreateProperty("Success",false);
                    helper.CreateProperty("Message", Convert.ToString(apiResponseObj.SelectToken("Message")));
                }
            }
            catch(Exception ex)
            {
                Logger.Error(string.Format("Error in BUsiness Conference class, Method ConferenceDial Exception --> {0}", ex.ToString()));
                helper.CreateProperty("Success", false);
                helper.CreateProperty("Message", "Something Went Rong");
            }
            return helper.GetResponse();
        }
        public JObject StartConference(int mode, int agentId, int accountId, int callId, int toAgentId)
        {
            try
            {
                Press3.DataAccessLayer.Conference conferenceObj = new Press3.DataAccessLayer.Conference(connectionString);
                DataSet ds = conferenceObj.StartConference(mode,agentId, accountId, callId, toAgentId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    JObject hangupResponse = new JObject();
                    JObject dialResponse = new JObject();
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (ds.Tables["OutputParameters"].Rows[0]["Success"].ToString() == "True")
                        {
                            dialResponse = ConferenceDial(ds, "Conference", toAgentId);
                            Logger.Info("StartConference dialResponse " + dialResponse.ToString());
                            if (Convert.ToBoolean(dialResponse.SelectToken("Success").ToString()))
                            {
                                if (ds.Tables[0].Rows[0]["OriginationUrl"]!=null && !ds.Tables[0].Rows[0]["OriginationUrl"].ToString().Contains("verto"))
                                {
                                    StringBuilder publishData = new StringBuilder();
                                    JObject messageJobj = new JObject(new JProperty("Channel_Name", "Agent_" + toAgentId.ToString()),
                                        new JProperty("CallId", callId),
                                        new JProperty("ConferenceRoom", ds.Tables[0].Rows[0]["ConferenceRoom"].ToString()),
                                        new JProperty("FromNumber", ds.Tables[0].Rows[0]["Source"].ToString()),
                                        new JProperty("IsAgent", false),
                                        new JProperty("CallType", 3),
                                        new JProperty("RequestUUID", dialResponse.SelectToken("RequestUUID").ToString()),
                                        new JProperty("Event", "enter"));
                                    Press3.DataAccessLayer.WebSocketController WSCObj = new Press3.DataAccessLayer.WebSocketController(connectionString);                                   
                                    WSCObj.InsertWsNofificationQueue(messageJobj.ToString());

                                    ds.Trace(messageJobj);
                                }
                            }
                        }
                    }
                    helper = new Press3.BusinessRulesLayer.Helper();
                    helper.ParseDataSet(ds);
                    helper.CreateProperty("ToAgentRequestUUID",Convert.ToString(dialResponse.SelectToken("RequestUUID")));
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In StartConference " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject EndConference(int agentId, int accountId, int callId,int mode)
        {
            try
            {
                Press3.DataAccessLayer.Conference conferenceObj = new Press3.DataAccessLayer.Conference(connectionString);
                DataSet ds = conferenceObj.EndConference(agentId, accountId, callId,mode);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Logger.Info("End conference Requested hangup calls count:"+ds.Tables[0].Rows.Count);
                        if (ds.Tables["OutputParameters"].Rows[0]["Success"].ToString() == "True")
                        {
                            foreach(DataRow _row in ds.Tables[0].Rows)
                            {
                                Gateways gatewaysObj = new Gateways();
                                gatewaysObj.RestApiRequest("CallUUID=" + _row["RequestUUID"].ToString(), _row["HttpUrl"].ToString() + "HangupCall/", "POST");
                            }
                        }
                    }
                    helper = new Press3.BusinessRulesLayer.Helper();
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In EndConference " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetConferenceRoom(int agentId,int accountId,int callId)
        {
            try
            {
                Press3.DataAccessLayer.Conference conferenceObj = new Press3.DataAccessLayer.Conference(connectionString);
                DataSet ds = conferenceObj.GetConferenceRoom(agentId,accountId, callId);
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
                Logger.Error("Exception In StartConference " + ex.ToString());
            }
            return helper.GetResponse();
        }
        void ParseParameters(HttpContext context)
        {
            try
            {
                if (context.Request.HttpMethod.ToString().ToUpper() == "GET")
                {
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CHANNEL_NAME]) == false)
                    {
                        httpParameters.ChannelName = context.Request.QueryString[UDC.HttpGetParametersLabels.CHANNEL_NAME].ToString();
                    }
                    else
                    {
                        httpParameters.ChannelName = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_DIGITS_MATCH]) == false)
                    {
                        httpParameters.ConfDigits = context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_DIGITS_MATCH].ToString();
                    }
                    else
                    {
                        httpParameters.ConfDigits = "0";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_VERTO_PHONE]) == false)
                    {
                        httpParameters.IsVertoPhone = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_VERTO_PHONE]);
                    }
                    else
                    {
                        httpParameters.IsVertoPhone = false;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_AGENT]) == false)
                    {
                        httpParameters.IsAgent = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_AGENT].ToString());
                    }
                    else
                    {
                        httpParameters.IsAgent = false;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_CALLER]) == false)
                    {
                        httpParameters.IsCaller = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_CALLER]);
                    }
                    else
                    {
                        httpParameters.IsCaller = false;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_WARM_TRANSFER]) == false)
                    {
                        httpParameters.IsWarmTransfer = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_WARM_TRANSFER].ToString());
                    }
                    else
                    {
                        httpParameters.IsWarmTransfer = false;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CALLER_SEQUENCE_NUMBER]) == false)
                    {
                        httpParameters.CallerSequenceNumber = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CALLER_SEQUENCE_NUMBER].ToString());
                    }
                    else
                    {
                        httpParameters.CallerSequenceNumber = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CALLER_FS_MEMBERID]) == false)
                    {
                        httpParameters.CallerFsMemberId = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CALLER_FS_MEMBERID].ToString());
                    }
                    else
                    {
                        httpParameters.CallerFsMemberId = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.GATEWAY_URL]) == false)
                    {
                        httpParameters.GatewayUrl = context.Request.QueryString[UDC.HttpGetParametersLabels.GATEWAY_URL];
                    }
                    else
                    {
                        httpParameters.GatewayUrl = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.TALKING_AGENT_REQUEST_UUID]) == false)
                    {
                        httpParameters.TalkingAgentRequestUUID = context.Request.QueryString[UDC.HttpGetParametersLabels.TALKING_AGENT_REQUEST_UUID];
                    }
                    else
                    {
                        httpParameters.TalkingAgentRequestUUID = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_TRANSFER_TO_AGENT]) == false)
                    {
                        httpParameters.IsTransferToAgent = Convert.ToBoolean(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_TRANSFER_TO_AGENT].ToString());
                    }
                    else
                    {
                        httpParameters.IsTransferToAgent = false;
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
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_PROFILE]) == false)
                    {
                        httpParameters.ConferenceProfile = context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_PROFILE];
                    }
                    else
                    {
                        httpParameters.ConferenceProfile = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_NAME]) == false)
                    {
                        httpParameters.ConferenceName = context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_NAME];
                    }
                    else
                    {
                        httpParameters.ConferenceName = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_ACTION]) == false)
                    {
                        httpParameters.ConferenceAction = context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_ACTION];
                    }
                    else
                    {
                        httpParameters.ConferenceAction = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_SIZE]) == false)
                    {
                        httpParameters.ConferenceSize = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_SIZE]);
                    }
                    else
                    {
                        httpParameters.ConferenceSize = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_UUID]) == false)
                    {
                        httpParameters.ConferenceUUID = context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_UUID];
                    }
                    else
                    {
                        httpParameters.ConferenceUUID = "";
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_MEMBER_ID]) == false)
                    {
                        if (context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_MEMBER_ID] == "null")
                        {
                            if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_INSTANCE_MEMBER_ID]) == false)
                            {
                                httpParameters.ConferenceMemberID = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_INSTANCE_MEMBER_ID]);
                            }
                            else
                            {
                                httpParameters.ConferenceMemberID = 0;
                            }
                        }
                        else
                        {
                            httpParameters.ConferenceMemberID = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.CONFERENCE_MEMBER_ID]);
                        }
                        
                    }
                    else
                    {
                        httpParameters.ConferenceMemberID = 0;
                        
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.EVENT_TIME_STAMP]) == false)
                    {
                        httpParameters.Eventtimestamp = Convert.ToInt32(context.Request.QueryString[UDC.HttpGetParametersLabels.EVENT_TIME_STAMP]);
                    }
                    else
                    {
                        httpParameters.Eventtimestamp = 0;
                    };
                    if (string.IsNullOrEmpty(context.Request.QueryString[UDC.HttpGetParametersLabels.IS_RING_URL]) == false)
                    {
                        if (context.Request.QueryString[UDC.HttpGetParametersLabels.IS_RING_URL].ToString() == "true")
                        {
                            httpParameters.IsRingUrl = true;
                        }
                        else
                        {
                            httpParameters.IsRingUrl = false;
                        }
                    }
                    else
                    {
                        httpParameters.IsRingUrl = false;
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


                    if (jsonObjParaMeters.SelectToken("IsWarmTransfer") != null)
                    {
                        httpParameters.IsWarmTransfer = Convert.ToBoolean(jsonObjParaMeters.SelectToken("IsWarmTransfer").ToString());
                    }
                    else
                    {
                        httpParameters.IsWarmTransfer =false;
                    }
                    if (jsonObjParaMeters.SelectToken("CallerFsMemberId") != null)
                    {
                        httpParameters.CallerFsMemberId = Convert.ToInt32(jsonObjParaMeters.SelectToken("CallerFsMemberId").ToString());
                    }
                    else
                    {
                        httpParameters.CallerFsMemberId = 0;
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceDigitsMatch") != null)
                    {
                        httpParameters.ConfDigits = jsonObjParaMeters.SelectToken("ConferenceDigitsMatch").ToString();
                    }
                    else
                    {
                        httpParameters.ConfDigits = "0";
                    }
                    if (jsonObjParaMeters.SelectToken("CallerSequenceNumber") != null)
                    {
                        httpParameters.CallerSequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken("CallerSequenceNumber").ToString());
                    }
                    else
                    {
                        httpParameters.CallerSequenceNumber = 0;
                    }


                    if (jsonObjParaMeters.SelectToken("GatewayURL") != null)
                    {
                        httpParameters.GatewayUrl = jsonObjParaMeters.SelectToken("GatewayURL").ToString();
                    }
                    else
                    {
                        httpParameters.GatewayUrl = "";
                    }
                    if (jsonObjParaMeters.SelectToken("TalkingAgentRequestUUID") != null)
                    {
                        httpParameters.TalkingAgentRequestUUID = jsonObjParaMeters.SelectToken("TalkingAgentRequestUUID").ToString();
                    }
                    else
                    {
                        httpParameters.TalkingAgentRequestUUID = "";
                    }

                    if (jsonObjParaMeters.SelectToken("IsTransferToAgent") != null)
                    {
                        httpParameters.IsTransferToAgent = Convert.ToBoolean(jsonObjParaMeters.SelectToken("IsTransferToAgent").ToString());
                    }
                    else
                    {
                        httpParameters.IsTransferToAgent = false;
                    }

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
                    if (jsonObjParaMeters.SelectToken("ConferenceProfile") != null)
                    {
                        httpParameters.ConferenceProfile = jsonObjParaMeters.SelectToken("ConferenceProfile").ToString();
                    }
                    else
                    {
                        httpParameters.ConferenceProfile = "";
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceName") != null)
                    {
                        httpParameters.ConferenceName = jsonObjParaMeters.SelectToken("ConferenceName").ToString();
                    }
                    else
                    {
                        httpParameters.ConferenceName = "";
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceAction") != null)
                    {
                        httpParameters.ConferenceAction = jsonObjParaMeters.SelectToken("ConferenceAction").ToString();
                    }
                    else
                    {
                        httpParameters.ConferenceAction = "";
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceSize") != null)
                    {
                        httpParameters.ConferenceSize = Convert.ToInt32(jsonObjParaMeters.SelectToken("ConferenceSize").ToString());
                    }
                    else
                    {
                        httpParameters.ConferenceSize = 0;
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceUUID") != null)
                    {
                        httpParameters.ConferenceUUID = jsonObjParaMeters.SelectToken("ConferenceUUID").ToString();
                    }
                    else
                    {
                        httpParameters.ConferenceUUID = "";
                    }
                    if (jsonObjParaMeters.SelectToken("ConferenceMemberID") != null)
                    {
                        httpParameters.ConferenceMemberID = Convert.ToInt32(jsonObjParaMeters.SelectToken("ConferenceMemberID").ToString());
                    }
                    else
                    {
                        httpParameters.ConferenceMemberID = 0;
                    }
                    if (jsonObjParaMeters.SelectToken("eventtimestamp") != null)
                    {
                        httpParameters.Eventtimestamp = Convert.ToInt32(jsonObjParaMeters.SelectToken("eventtimestamp").ToString());
                    }
                    else
                    {
                        httpParameters.Eventtimestamp = 0;
                    }


                    if (jsonObjParaMeters.SelectToken("sequencenumber") != null)
                    {
                        httpParameters.SequenceNumber = Convert.ToInt32(jsonObjParaMeters.SelectToken("sequencenumber").ToString());
                    }
                    else
                    {
                        httpParameters.SequenceNumber = 0;
                    }


                };

            }catch(Exception ex){

                Logger.Error(ex.ToString());
            }
           
        }
    }
}
