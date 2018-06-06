using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using UDC = Press3.UserDefinedClasses;
using DAL = Press3.DataAccessLayer;
using System.Data;
using Press3.Utilities;
using Newtonsoft.Json.Linq;

namespace Press3.BusinessRulesLayer
{
    public class DirectDialExtension
    {
        public string GetXml(HttpContext context, string connectionString)
        {
            string callBackUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["CallBackUrl"].ToString();
            string answerUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["AnswerUrl"].ToString();
            string hangupUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["HangupUrl"].ToString();
            string conferenceCallBackUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["ConferenceCallBackURL"].ToString();
            Int32 accountId = 0;
            string responseXml = "";
            JObject responseData = new JObject();
            Helper helper = new Press3.BusinessRulesLayer.Helper();
            UDC.ReadRestParameters restParameters = new UDC.ReadRestParameters(context);
            try
            {
                Logger.Info("Event:" + restParameters.CallEvent);
                if (restParameters.CallEvent.Equals("getkeys"))
                {
                    DAL.DirectDialExtension dialExtObj = new DAL.DirectDialExtension(connectionString);
                    DataSet ds = new DataSet();
                    if (!string.IsNullOrEmpty(restParameters.Digits))
                    {
                        ds = dialExtObj.DialExtension(restParameters);
                        //if (ds != null)
                        //{
                        //    helper.ParseDataSet(ds);
                        //    responseData = helper.GetResponse();
                        //    responseXml = responseData.SelectToken("ResponseXML").ToString();
                        //    //Make Call to Agent with AnswerXml <Conference>{cutomer_call_request_uuid}</Conference>                            
                        //    //From,To,AnswerUrl,HangupUrl,AnswerXml
                        //    //AnswerUrl={domain}/DirectDial.ashx HangupUrlSame
                        //    //
                        //    //if (ds.Tables.Count > 1)
                        //    //{
                        //    //    JArray gatewayDetailsObj = (responseData.SelectToken("GatewayDetails") as JArray) as JArray;
                        //    //}
                        //}
                        //else
                        //{
                        //    responseXml = "<Response><Hangup data='No data return from database'/></Response>";
                        //}
                        if (ds != null)
                        {
                            helper.ParseDataSet(ds);
                            responseData = helper.GetResponse();
                            responseXml = responseData.SelectToken("ResponseXML").ToString();
                            Press3.DataAccessLayer.Conference conferenceObj = new Press3.DataAccessLayer.Conference(connectionString);
                            if (!string.IsNullOrEmpty(Convert.ToString(responseData.SelectToken("AccountId"))))
                                accountId = Convert.ToInt32(responseData.SelectToken("AccountId").ToString());
                            //if (accountId > 0)
                            //{
                            //    ManagerDashBoardCounts(connectionString, accountId);
                            //}
                            if (ds.Tables.Count > 1)
                            {
                                JArray gatewayDetailsObj = (responseData.SelectToken("GatewayDetails") as JArray) as JArray;
                                Gateways gatewaysObj = new Gateways();
                                string postingData = "";
                                JObject restApiResponse = new JObject();
                                string answerXml = "";
                                foreach (JObject j in gatewayDetailsObj)
                                {

                                    Logger.Info("GatewayDetails loop in direct dial Extension:" + j.ToString());
                                    restApiResponse = new JObject();
                                    string ringUrl = callBackUrl + "?ChannelName=Agent_" + (j.SelectToken("AgentId")) + "&IsVertoPhone=" + (j.SelectToken("OriginationUrl").ToString().Contains("verto.rtc") ? "true" : "false") + "&IsAgent=true&isTransferToAgent=false&IsRingUrl=true";
                                    string digitsMatch = "digitsMatch='" + j.SelectToken("ConferenceDigits") + "'";

                                    //answerXml = "<Response><Conference stayAlone='true' callbackMethod='GET' callbackUrl='" + callBackUrl + "?ChannelName=Agent_" + (j.SelectToken("AgentId")) + "&#38;IsVertoPhone=" + (j.SelectToken("OriginationUrl").ToString().Contains("verto.rtc") ? "true" : "false") + "&#38;IsAgent=true&#38;isTransferToAgent=false";
                                    answerXml = "<Response><Conference " + digitsMatch + " stayAlone='true' callbackMethod='GET' callbackUrl='" + callBackUrl + "?ChannelName=Agent_" + (j.SelectToken("AgentId")) + "&#38;IsVertoPhone=" + (j.SelectToken("OriginationUrl").ToString().Contains("verto.rtc") ? "true" : "false") + "&#38;IsAgent=true&#38;isTransferToAgent=false";
                                  
                                    answerXml += "&#38;GatewayURL=" + j.SelectToken("HttpUrl").ToString() + "' >" + j.SelectToken("Room") + "</Conference></Response>";

                                  //  postingData = "RingUrl=" + HttpUtility.UrlEncode(ringUrl) + "&AnswerXml=" + System.Web.HttpUtility.UrlEncode(answerXml) + "&Priority=H&SequenceNumber=" + j.SelectToken("SequenceNumber") + "&From=";
                                   postingData = "AnswerXml=" + System.Web.HttpUtility.UrlEncode(answerXml) + "&Priority=H&SequenceNumber=" + j.SelectToken("SequenceNumber") + "&From=";
                                    postingData += j.SelectToken("Source") + "&To=" + j.SelectToken("Number") + "&OriginateSleep=1&AnswerUrl=" + conferenceCallBackUrl + "&Gateways=";
                                    postingData += j.SelectToken("OriginationUrl") + "&HangupUrl=" + hangupUrl + "&ExtraDialString=" + System.Web.HttpUtility.UrlEncode(j.SelectToken("ExtraDialString").ToString());
                                    Logger.Info("call Request Executing to The server in dial extension : " + j.SelectToken("HttpUrl").ToString() + "posting data " + postingData.ToString());
                                    // Logger.Info("httpurl " + j.SelectToken("HttpUrl").ToString());
                                  
                                    
                                    restApiResponse = gatewaysObj.RestApiRequest(postingData, j.SelectToken("HttpUrl").ToString() + "Call/", "POST");
                                    if (Convert.ToBoolean(restApiResponse.SelectToken("Success").ToString()))
                                    {
                                        Logger.Debug("Call Initiated Response in dial Extension:" + restApiResponse);
                                        var uuid = restApiResponse.SelectToken("RequestUUID").ToString();
                                        var seqNumber = Convert.ToInt32(j.SelectToken("SequenceNumber").ToString());
                                        conferenceObj.UpdateConferenceRequestUUID(uuid, seqNumber);


                                    }
                                    else
                                    {
                                        Logger.Info("Call Request not Success in dial extension please check Ycom Rest logs for more info payload:" + postingData);
                                        responseXml = "<Response><Hangup data='Issue in connect agent in dial extension'/></Response>";
                                    }
                                }

                            }
                            responseXml = "<Response>" + responseXml + "</Response>";
                        }
                        else
                        {
                            responseXml = "<Response><Hangup data='No data return from database'/></Response>";
                        }
                    }
                }
               
            }catch (Exception ex){
                Logger.Error(ex.ToString());
            }
            return responseXml;
        }
    }
}
