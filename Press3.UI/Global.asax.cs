using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using Press3.UI.CommonClasses;
using Press3.Utilities;
using Press3.BusinessRulesLayer;
using Newtonsoft.Json.Linq;

namespace Press3.UI
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            Utilities.Logger.Initialize();
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {
            Int32 loginId = 0;
            Int32 agentId = 0;
            try
            {
                if (this.Session["LoginId"] != null)
                {
                    loginId = Convert.ToInt32(this.Session["LoginId"].ToString());
                    agentId = Convert.ToInt32(this.Session["AgentId"].ToString());

                    JObject resObj = new JObject();
                    Agent agentObj = new Agent();
                    resObj = agentObj.AgentLogout(MyConfig.MyConnectionString, loginId, agentId, 1);
                    if (resObj.SelectToken("Success").ToString() == "True")
                    {
                        this.Session.Clear();
                        this.Session.Abandon();
                        //this.Context.Response.Redirect("/Login.aspx?message=Session expired");
                        //HttpContext.Current.Response.Redirect("/Login.aspx?message=Session expired");
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In LogoutSession Global.asax" + ex.ToString());
            }
        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}