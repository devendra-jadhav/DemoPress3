using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class CallHistoryDetails
    {
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public int CallType { get; set; }
        public int SkillGroupId { get; set; }
        public int SkillId { get; set; }
        public int Duration { get; set; }
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public string Date { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int CallId { get; set; }
        public int CallDirection { get; set; }
        public int RoleId { get; set; }
        public int CbrId { get; set; }
        public int SessionAgentId { get; set; }
        public int StudioId { get; set; }

        public int Exceldownload { get; set; }

        public string ConferenceCallTypeId { get; set; }
      
    }
}
