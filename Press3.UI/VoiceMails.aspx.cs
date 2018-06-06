using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Press3.UI
{
    public partial class VoiceMails : System.Web.UI.Page
    {
        public int agentId = 0;
        public Byte roleId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {

            
            if (Session["AgentId"] == null)
            {
                Response.Redirect("/Login.aspx?message=Session expired");
                return;
            }
            else
            {
                agentId = Convert.ToInt32(Session["AgentId"]);
                roleId = Convert.ToByte(Session["RoleId"].ToString());
                
            }
        }
    }
}