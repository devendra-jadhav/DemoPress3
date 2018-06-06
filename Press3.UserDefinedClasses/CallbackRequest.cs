using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class CallbackRequest
    {
        public int CbrId { get; set; }
        public int Mode { get; set; }
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public int CallId { get; set; }
        public int CallerId { get; set; }
        public string Mobile { get; set; }
        public int DialType { get; set; }
        public string Notes { get; set; }
        public string DateTime { get; set; }
        public int StatusId { get; set; }
        public int AssignedAgentId { get; set; }
        public int SkillGroupId { get; set; }
        public int DialOutType { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string SearchText { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int StudioId { get; set; } 
    }
}

