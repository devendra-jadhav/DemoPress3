using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Press3.UI
{
    public partial class MyCallBackRequests : System.Web.UI.Page
    {
        public int agentId = 0, CbrId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Convert.ToInt32(Session["RoleId"]) != 1)
            {
                Response.Redirect("/UnAuthorised.aspx");
                return;
            }
            if (Session["AgentId"] == null)
            {
                Response.Redirect("/Login.aspx?message=Session expired");
                return;
            }
            else
            {
                agentId = Convert.ToInt32(Session["AgentId"]);
            }
            if (!string.IsNullOrEmpty(Request.QueryString["CbrId"]))
            {
                CbrId = Convert.ToInt32(Request.QueryString["CbrId"]);
            }
        }
    }
}