using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class GeneralSettings
    {
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public byte mode { get; set;}
        public byte SLAType { get; set; }
        public int ThresholdInSeconds { get; set; }
        public int TargetPercentage { get; set; }
        public bool IsVoiceMail { get; set; }
        public byte DailExtension { get; set; }
    }
}
