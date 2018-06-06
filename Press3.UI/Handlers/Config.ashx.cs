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
    /// Summary description for Config
    /// </summary>
    public class Config : IHttpHandler, IRequiresSessionState
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

                        int type = Convert.ToInt32(context.Request["type"]);
                        JObject resJObj = new JObject();
                        switch (type)
                        {
                            case 1:
                                resJObj = ConfigInfo(context);
                                context.Response.Write(resJObj);
                                break;
                        }
                    }
                }
            }

            catch (Exception ex)
            {
                Logger.Error(ex.ToString());

            }
            
        }

        private JObject ConfigInfo(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.ConfigInfo configObject = new Press3.BusinessRulesLayer.ConfigInfo();
                responseJObj = configObject.GetConfigInfo(MyConfig.MyConnectionString, agentId, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
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
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
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