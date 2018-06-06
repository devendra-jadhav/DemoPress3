using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class AgentHistory
    {
       public Int32 AccountId { get; set; }
       public Int32 AgentId { get; set; }
       public Int32 RoleId { get; set; }
       public Int32 SessionAgentId { get; set; }
       public Byte DurationType { get; set; }
       public String FromDate { get; set; }
       public String ToDate { get; set; }
       public Int32 SkillGroupId { get; set; }
       public Double Rating { get; set; }
       public Int32 Index { get; set; }
       public Int32 Length { get; set; }

    }
}
