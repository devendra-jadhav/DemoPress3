using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class AgentSkill
    {
        public int Id { get; set; }
        public int AgentId { get; set; }
        public int SkillId { get; set; }
        public bool IsActive { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int CreatedBy { get; set; }

    }
}
