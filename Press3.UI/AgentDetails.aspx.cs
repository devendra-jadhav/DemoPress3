using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Press3.UI
{
    public partial class AgentDetails : System.Web.UI.Page
    {
        public Int32 accountId = 0, agentId = 0, roleId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["AccountId"] == null)
            {
                Response.Redirect("/Login.aspx?message=Session expired");
                return;
            }
            else
            {
                accountId = Convert.ToInt32(Session["AccountId"]);
                agentId = Convert.ToInt32(Session["AgentId"]);
                roleId = Convert.ToInt32(Session["RoleId"]);
            }
            if (Convert.ToInt32(Session["RoleId"]) != 3)
            {
                Response.Redirect("/UnAuthorised.aspx");
                return;
            }
        }
    }
}