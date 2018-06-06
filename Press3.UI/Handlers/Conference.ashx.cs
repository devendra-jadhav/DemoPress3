using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using Press3.BusinessRulesLayer;
using System.Web.SessionState;
using Press3.UI.CommonClasses;
using Press3.UI.AppCode;
using Press3.Utilities;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Conference
    /// </summary>
    public class Conference : IHttpHandler, IRequiresSessionState
    {

        public int agentId = 0, accountId = 0;
        public Int32 loginId = 0;
        public JObject sessionObj = new JObject();
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Session["AgentId"] != null)
                {
                    agentId = Convert.ToInt32(context.Session["AgentId"]);
                    loginId = Convert.ToInt32(context.Session["LoginId"]);
                    if (context.Session["AccountId"] != null)
                        accountId = Convert.ToInt32(context.Session["AccountId"]);
                }
                else
                {
                    HttpContext.Current.Response.StatusCode = 401;
                    return;
                }

                sessionObj = CheckSession(context);
                if (sessionObj != null)
                {
                    if (sessionObj.SelectToken("Success").ToString() == "False")
                    {
                        HttpContext.Current.Response.StatusCode = 406;
                        return;
                    }
                    else
                    {
                        JObject resJObj = new JObject();
                        int type = Convert.ToInt32(context.Request["type"]);

                        switch (type)
                        {

                            case 1:
                                resJObj = CompleteTransfer(context);
                                context.Response.Write(resJObj);
                                break;
                            case 2:
                                resJObj = HoldUnHoldCaller(context);
                                context.Response.Write(resJObj);
                                break;
                            case 3:
                                resJObj = CancelWarmTransfer(context);
                                context.Response.Write(resJObj);
                                break;
                            case 4:
                                resJObj = StartConference(context);
                                context.Response.Write(resJObj);
                                break;
                            case 5:
                                resJObj = EndConference(context);
                                context.Response.Write(resJObj);
                                break;
                            case 6:
                                resJObj = GetConferenceRoom(context);
                                context.Response.Write(resJObj);
                                break;
                            case 7:
                                resJObj = HangUp(context);
                                context.Response.Write(resJObj);
                                break;
                            case 8:
                                resJObj = MuteUnMute(context);
                                context.Response.Write(resJObj);
                                break;

                        }
                    }
                }
                
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in conference[ProcessRequest]" + ex.ToString());

            }
        }
        private JObject MuteUnMute(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Conference callsObject = new Press3.BusinessRulesLayer.Conference(MyConfig.MyConnectionString);
                responseJObj = callsObject.ConferenceMuteUnMute(context);
                Logger.Debug("Response Object in Conference[MuteUnMute]" + responseJObj);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in conference[MuteUnMute]" + ex.ToString());
            }
            return responseJObj;
        }
        private JObject HangUp(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Conference callsObject = new Press3.BusinessRulesLayer.Conference(MyConfig.MyConnectionString);
                responseJObj = callsObject.HangUp(context);
                Logger.Debug("Response Object in Conference[HangUp]" + responseJObj);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in conference[HangUp]" + ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetConferenceRoom(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Conference callsObject = new Press3.BusinessRulesLayer.Conference(MyConfig.MyConnectionString);
                responseJObj = callsObject.GetConferenceRoom(agentId,accountId, Convert.ToInt32(context.Request["CallId"]));
                Logger.Debug("Response Object in Conference[GetConferenceRoom] with Call Id: " + Convert.ToInt32(context.Request["CallId"]) + ",Is:" + responseJObj);


            }
            catch (Exception ex)
            {
                Logger.Error("Exception in conference[GetConferenceRoom]" + ex.ToString());
            }
            return responseJObj;
        }
        private JObject EndConference(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Conference callsObject = new Press3.BusinessRulesLayer.Conference(MyConfig.MyConnectionString);
                responseJObj = callsObject.EndConference(agentId,accountId,Convert.ToInt32(context.Request["CallId"]),2);
                Logger.Debug("Response Object in Conference[EndConference] With Mode:2 CallId:" + Convert.ToInt32(context.Request["CallId"]) + ",Is:" + responseJObj);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in conference[EndConference]" + ex.ToString());
            }
            return responseJObj;
        }
        private JObject StartConference(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Conference callsObject = new Press3.BusinessRulesLayer.Conference(MyConfig.MyConnectionString);
                responseJObj = callsObject.StartConference(Convert.ToInt32(context.Request["Mode"]), agentId, accountId, Convert.ToInt32(context.Request["CallId"]), Convert.ToInt32(context.Request["ToAgentId"]));
                Logger.Debug("Response Object in Conference[StartConference] with Mode:" + Convert.ToInt32(context.Request["Mode"]) + ",AgentID:" + agentId + ",AccountId:" + accountId + ",CallID:" + Convert.ToInt32(context.Request["CallId"]) + ",ToAgentId:" + Convert.ToInt32(context.Request["ToAgentId"]) + "-->Is:" + responseJObj);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in conference[StartConference]" + ex.ToString());
            }
            return responseJObj;
        }
        private JObject CancelWarmTransfer(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Conference conferenceObject = new Press3.BusinessRulesLayer.Conference(MyConfig.MyConnectionString);
                responseJObj = conferenceObject.CancelWarmTransfer(context);
                Logger.Debug("Response Object in Conference[CancelWarmTransfer] Is:" + responseJObj);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in conference[CancelWarmTransfer]" + ex.ToString());
            }
            return responseJObj;
        }
        private JObject HoldUnHoldCaller(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Conference conferenceObject = new Press3.BusinessRulesLayer.Conference(MyConfig.MyConnectionString);
                responseJObj = conferenceObject.ChangeConferenceRoom(context);
                Logger.Debug("Response Object in Conference[HoldUnHoldCaller] Is: " + responseJObj);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in conference[HoldUnHoldCaller]" + ex.ToString());
            }
            return responseJObj;
        }
        private JObject CompleteTransfer(HttpContext context)
        {
            JObject responseJObj = new JObject();
            JObject checkCompleteTransfer = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Conference conferenceObject = new Press3.BusinessRulesLayer.Conference(MyConfig.MyConnectionString);
                checkCompleteTransfer = conferenceObject.CheckCompleteTransfer(context);
                if (Convert.ToBoolean(Convert.ToString(checkCompleteTransfer.SelectToken("Success"))) == true)
                {
                    responseJObj = conferenceObject.CompleteTransfer(context);
                    Logger.Debug("Response Object in Conference[CompleteTransfer] Is:" + responseJObj);

                }
                else
                {

                   return checkCompleteTransfer;
                }


               // responseJObj = conferenceObject.CompleteTransfer(context);
                
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in Conference[CompleteTransfer]" + ex.ToString());
            }
            return responseJObj;
        }
        public JObject CheckSession(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.CheckSession(MyConfig.MyConnectionString, loginId);
                Logger.Debug("Result Object in Conference[CheckSession] With loginId:"+loginId+",Is:" + resultObj);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in Conference[CheckSession]" + ex.ToString());
            }
            return resultObj;
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}