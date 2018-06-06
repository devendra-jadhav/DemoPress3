using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Press3.UI.CommonClasses;

namespace Press3.UI
{
    public partial class AgentHome : System.Web.UI.Page
    {
        public int agentId = 0; public byte isAutoSubject = 0; public byte isAlsagr = 0; public byte IsAutoRefresh = 0;
        public int customerId = 0; public string callUUID = "";
        public string customerMobile = ""; public int callId = 0;
        public int cbrId = 0; public int communicationTypeId = 0;
        public void Page_Load(object sender, EventArgs e)
        {
            if (Session["AgentId"] == null)
            {
                Response.Redirect("/Login.aspx?message=Session expired");
                return;
            }
            else
            {
                agentId = Convert.ToInt32(Session["AgentId"]);
                isAutoSubject = Convert.ToByte(MyConfig.IsAutoSubject);
                isAlsagr = Convert.ToByte(MyConfig.IsAlsagr);
                IsAutoRefresh = Convert.ToByte(MyConfig.IsAutoRefresh);
                if (!string.IsNullOrEmpty(Request.QueryString["CallId"]))
                {
                    callId = Convert.ToInt32(Request.QueryString["CallId"]);
                }
                if (!string.IsNullOrEmpty(Request.QueryString["CbrId"]))
                {
                    cbrId = Convert.ToInt32(Request.QueryString["CbrId"]);
                }
                if (!string.IsNullOrEmpty(Request.QueryString["CustomerId"]))
                {
                    customerId = Convert.ToInt32(Request.QueryString["CustomerId"]);
                }
                if (!string.IsNullOrEmpty(Request.QueryString["CallUUID"]))
                {
                    callUUID = Request.QueryString["CallUUID"];
                }
                if (!string.IsNullOrEmpty(Request.QueryString["CustomerMobile"]))
                {
                    customerMobile = Request.QueryString["CustomerMobile"];
                }
                if (!string.IsNullOrEmpty(Request.QueryString["CommunicationTypeId"]))
                {
                    communicationTypeId = Convert.ToInt32(Request.QueryString["CommunicationTypeId"]);
                }
            }
        }
    }
}