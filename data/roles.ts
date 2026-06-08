export const DEFAULT_PERMISSIONS: PermissionGroup[] = [
  {
    category: "Discography",
    permissions: [
      { id: "add-release", name: "Add Release", enabled: false },
      { id: "delete-release", name: "Delete Release", enabled: false },
      { id: "edit-release", name: "Edit Release", enabled: false },
    ],
  },
  {
    category: "Artists",
    permissions: [
      { id: "invite-artist", name: "Invite Artist", enabled: false },
      { id: "delete-artist", name: "Delete Artist", enabled: false },
      { id: "edit-artist-details", name: "Edit Artist Details", enabled: false },
    ],
  },
  {
    category: "Trends & Analytics",
    permissions: [
      { id: "see-streams", name: "See Streams", enabled: true },
      { id: "see-earnings", name: "See Earnings", enabled: true },
      { id: "see-growth-platforms", name: "See Growth by Platforms", enabled: true },
      { id: "see-world-dominations", name: "See World Dominations", enabled: true },
    ],
  },
  {
    category: "Earnings & Royalties",
    permissions: [
      { id: "see-earning-stats", name: "See Earning Stats", enabled: true },
      { id: "export-royalties-data", name: "Export Royalties Data", enabled: true },
    ],
  },
  {
    category: "Wallet",
    permissions: [
      { id: "withdraw-earnings", name: "Withdraw Earnings", enabled: false },
      { id: "report-transactions", name: "Report transactions", enabled: false },
      { id: "update-withdrawal-account", name: "Update Withdrawal Account", enabled: false },
      { id: "make-payment", name: "Make Payment", enabled: false },
    ],
  },
  {
    category: "Team",
    permissions: [
      { id: "create-team-member", name: "Create New Team Member", enabled: false },
      { id: "edit-team-details", name: "Edit Team Details", enabled: false },
      { id: "delete-team", name: "Delete Team", enabled: false },
    ],
  },
  {
    category: "Roles & Permission",
    permissions: [
      { id: "create-roles", name: "Create Roles", enabled: false },
      { id: "update-roles-permission", name: "Update Roles and Permission", enabled: false },
    ],
  },
];

export const roles: Role[] = [
  {
    id: "business-analyst",
    name: "Business Analyst",
    description: "Wallet, Artist, Releases, and Earnings",
    teamCount: 1,
    permissions: DEFAULT_PERMISSIONS.map((group) => {
      if (group.category === "Wallet" || group.category === "Earnings & Royalties") {
        return {
          ...group,
          permissions: group.permissions.map((p) => ({ ...p, enabled: true })),
        };
      }
      return group;
    }),
  },
  {
    id: "product-manager",
    name: "Product Manager",
    description: "User Stories, Backlogs, and Sprints",
    teamCount: 5,
    permissions: DEFAULT_PERMISSIONS.map((group) => ({
      ...group,
      permissions: group.permissions.map((p) => ({ ...p, enabled: true })),
    })),
  },
  {
    id: "ui-ux-designer",
    name: "UI/UX Designer",
    description: "Wireframes, Prototypes, and User Testing",
    teamCount: 3,
    permissions: DEFAULT_PERMISSIONS.map((group) => {
      if (group.category === "Discography") {
        return {
          ...group,
          permissions: group.permissions.map((p) => ({ ...p, enabled: true })),
        };
      }
      return group;
    }),
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    description: "Code, Debugging, and Deployment",
    teamCount: 4,
    permissions: DEFAULT_PERMISSIONS.map((group) => {
      if (group.category === "Trends & Analytics" || group.category === "Discography") {
        return {
          ...group,
          permissions: group.permissions.map((p) => ({ ...p, enabled: true })),
        };
      }
      return group;
    }),
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    description: "Data Analysis, Models, and Predictions",
    teamCount: 2,
    permissions: DEFAULT_PERMISSIONS,
  },
  {
    id: "marketing-specialist",
    name: "Marketing Specialist",
    description: "Campaigns, SEO, and Analytics",
    teamCount: 3,
    permissions: DEFAULT_PERMISSIONS,
  },
  {
    id: "sales-manager",
    name: "Sales Manager",
    description: "Leads, Conversions, and Revenue",
    teamCount: 6,
    permissions: DEFAULT_PERMISSIONS,
  },
  {
    id: "content-creator",
    name: "Content Creator",
    description: "Blogs, Videos, and Social Media",
    teamCount: 2,
    permissions: DEFAULT_PERMISSIONS,
  },
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Help Desk, Resolutions, and Feedback",
    teamCount: 4,
    permissions: DEFAULT_PERMISSIONS,
  },
  {
    id: "quality-assurance",
    name: "Quality Assurance",
    description: "Testing, Bug Reports, and Quality Control",
    teamCount: 3,
    permissions: DEFAULT_PERMISSIONS,
  },
  {
    id: "project-coordinator",
    name: "Project Coordinator",
    description: "Scheduling, Resources, and Communication",
    teamCount: 2,
    permissions: DEFAULT_PERMISSIONS,
  },
  {
    id: "hr-manager",
    name: "HR Manager",
    description: "Recruiting, Training, and Employee Relations",
    teamCount: 1,
    permissions: DEFAULT_PERMISSIONS,
  },
  {
    id: "financial-analyst",
    name: "Financial Analyst",
    description: "Forecasting, Budgeting, and Reporting",
    teamCount: 2,
    permissions: DEFAULT_PERMISSIONS,
  },
  {
    id: "research-analyst",
    name: "Research Analyst",
    description: "Market Research, Trends, and Insights",
    teamCount: 1,
    permissions: DEFAULT_PERMISSIONS,
  },
];
