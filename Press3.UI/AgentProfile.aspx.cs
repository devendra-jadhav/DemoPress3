using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Press3.UI
{
    public partial class AgentProfile : System.Web.UI.Page
    {
        public Int32 agentId = 0; public Int32 roleId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Request.QueryString["AgentId"] != null)
                {
                    agentId = Convert.ToInt32(Request.QueryString["AgentId"]);
                }
                if (Request.QueryString["RoleId"] != null)
                {
                    roleId = Convert.ToInt32(Request.QueryString["RoleId"]);
                }
                if(Convert.ToInt32(Session["RoleId"]) == 1)
                {
                    if(Convert.ToInt32(Session["AgentId"]) != agentId)
                    {
                        Response.Redirect("/UnAuthorised.aspx");
                    }
                }
            }
        }
    }
}