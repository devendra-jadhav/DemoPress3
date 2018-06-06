using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class VoiceMail
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public int RoleId { get; set; }
        public int SkillGroupId { get; set;}
        public int AssignStatus { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string CallerDetails { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int StudioId { get; set; }
        public int SessionAgentId { get; set; }
    }
}
