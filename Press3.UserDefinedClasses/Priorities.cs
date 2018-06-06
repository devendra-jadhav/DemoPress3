using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class Priorities
    {
        public int Mode { get; set; }
        public int AccountId { get; set; }
        public int PriorityId { get; set; }
        public String PriorityName { get; set; }
        public int PriorityUnitId { get; set; }
        public Decimal PriorityValue { get; set; }
        public Boolean IsDefault { get; set; }
        public string ColorCode { get; set; }
        public int AgentId { get; set; }
    }
}

