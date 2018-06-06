using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class TimeSlot
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public byte Mode { get; set; }

        public string Name { get; set; }
        public string TimeSlotTimings { get; set; }
    }
}
