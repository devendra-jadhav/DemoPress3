using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json.Linq;
using Press3.BusinessRulesLayer;
using Press3.Utilities;
using Press3.UI.CommonClasses;

namespace Press3.UI
{
    public partial class PostLogin : System.Web.UI.MasterPage
    {
        public Int32 loginId = 0;
        public Int32 agentId = 0;
        public Byte roleId = 0;
        public Int32 accountId = 0;
        public string agentName = string.Empty;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["AgentName"] == null)
            {
                Response.Redirect("/Login.aspx?message=Session expired");
                return;
            }
            else
            {
                agentName = Session["AgentName"].ToString();
                roleId = Convert.ToByte(Session["RoleId"].ToString());
            }
        }
        public void Logout_Click(object sender, EventArgs e)
        {
            loginId = Convert.ToInt32(HttpContext.Current.Request.Cookies["Press3Cookie"]["LoginId"]);
            agentId = Convert.ToInt32(HttpContext.Current.Request.Cookies["Press3Cookie"]["AgentId"]);
            roleId = Convert.ToByte(Session["RoleId"].ToString());
            accountId = Convert.ToInt32(Session["AccountId"].ToString());
            Session.Clear();
            Session.Abandon();
            LogoutSession(loginId, agentId);
            if (roleId == 1)
            {
                StudioController studioControllerObj = new StudioController();
                studioControllerObj.ManagerDashBoardCounts(MyConfig.MyConnectionString, accountId, "AgentLogout");
            }
            if (HttpContext.Current.Request.Cookies["Press3Cookie"] != null)
            {
                HttpCookie authCookie = new HttpCookie("Press3Cookie", "");
                authCookie.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(authCookie);
            }
            Response.Redirect("/Login.aspx");
        }
        public void LogoutSession(Int32 loginId, Int32 agentId)
        {
            try
            {
                Agent agentObj = new Agent();
                agentObj.AgentLogout(MyConfig.MyConnectionString, loginId, agentId);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In LogoutSession UI " + ex.ToString());
            }
        }
    }
}