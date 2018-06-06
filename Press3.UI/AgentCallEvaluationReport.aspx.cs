using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Press3.UI
{
    public partial class AgentCallEvaluationReport : System.Web.UI.Page
    {
        public int roleId = 0;
        public int agentId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["AccountId"] == null)
            {
                Response.Redirect("/Login.aspx?message=Session expired");
                return;
            }

            roleId = Convert.ToInt32(Session["RoleId"]);
            agentId = Convert.ToInt32(Session["AgentId"]);
        }
    }
}