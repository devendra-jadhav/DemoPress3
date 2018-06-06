using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class SkillGroup
    {
        private List<int> _skillIds = new List<int>();
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<int> SkillIds
        {
            get { return _skillIds; }
            set { _skillIds = value; }
        }
        public bool IsActive { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
    }
}
