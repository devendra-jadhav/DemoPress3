using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Press3.UI.CommonClasses;

namespace Press3.UI
{
    public partial class CallerDetails : System.Web.UI.Page
    {
        public string callerNumber = "";
        public int flagpopup = 0;

        public byte isAutoSubject = 0;

        public byte isAlsagr = 0;
        public int callId = 0;

        protected void Page_Load(object sender, EventArgs e)
        {
            isAlsagr = Convert.ToByte(MyConfig.IsAlsagr);
            isAutoSubject = Convert.ToByte(MyConfig.IsAutoSubject);

            if(Request["CallerNumber"] != null)
            {
                callerNumber = Request["CallerNumber"].ToString();
            }

            if (Request["flagpopup"] != null)
            {
                flagpopup = Convert.ToInt32(Request["flagpopup"].ToString());
            }

            if (!string.IsNullOrEmpty(Request.QueryString["CallId"]))
            {
                callId = Convert.ToInt32(Request.QueryString["CallId"]);
            }
        }
    }
}