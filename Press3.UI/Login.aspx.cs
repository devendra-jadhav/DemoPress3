using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Press3.UI
{
    public partial class Login : System.Web.UI.Page
    {
        public Byte roleId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (HttpContext.Current.Session["AgentId"] != null)
            {
                roleId = Convert.ToByte(HttpContext.Current.Session["RoleId"]);
                if (roleId == 1) {
                    Response.Redirect("/AgentHome.aspx");
                }
                else if (roleId == 2) {
                    Response.Redirect("/SupervisorDashboard.aspx");
                }
                else if (roleId == 3) {
                    Response.Redirect("/ManagerDashboard.aspx");
                }
                else if (roleId == 4)
                {
                    Response.Redirect("/TicketManagement.aspx");
                }
            }
        }
    }
}