using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Press3.UI
{
    public partial class AgentProfileSettings : System.Web.UI.Page
    {
        public int type = 0,agentId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if(!string.IsNullOrEmpty(Convert.ToString(Request["AgentId"])))
            {
                type = 1;
                agentId = Convert.ToInt32(Request["AgentId"]);
            }
        }


    }
}