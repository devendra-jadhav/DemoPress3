using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Press3.UI
{
    public partial class ScoreCard : System.Web.UI.Page
    {
        public int callId = 0;
        public int agentId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["AccountId"] == null)
            {
                Response.Redirect("/Login.aspx?message=Session expired");
                return;
            }

            if (Request.QueryString["CallId"] == null)
            {
                Response.Write("<script>alert('Pass CallId parameter');</script>");
                Response.Write("Pass CallId parameter");
                Response.End();
                return;
            }else if (Request.QueryString["CallId"] != null)
            {
                int n;
                bool isNumeric = int.TryParse(Request.QueryString["CallId"], out n);
                if (isNumeric == false) {
                    Response.Write("<script>alert('Pass CallId parameter as integer');</script>");
                    Response.Write("Pass CallId parameter as integer");
                    Response.End();
                    return;
                }
                else
                {
                    callId = Convert.ToInt32(Request.QueryString["CallId"]);
                }
                
            }

            if (Request.QueryString["AgentId"] == null)
            {
                Response.Write("<script>alert('Pass AgentId parameter');</script>");
                Response.Write("Pass AgentId parameter");
                Response.End();
                return;
            }
            else if (Request.QueryString["AgentId"] != null)
            {
                 int n;
                 bool isNumeric = int.TryParse(Request.QueryString["AgentId"], out n);
                if (isNumeric == false)
                {
                    Response.Write("<script>alert('Pass AgentId parameter as integer');</script>");
                    Response.Write("Pass AgentId parameter");
                    Response.End();
                    return;
                }
                else
                {
                    agentId = Convert.ToInt32(Request.QueryString["AgentId"]);
                }
            }

        }
    }
}