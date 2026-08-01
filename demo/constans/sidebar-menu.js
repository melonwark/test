const sidebarMenu = [
  {
    title: 'Sidebar',
    regExpForDetermineActivePoint: '^\\/sidebar(?:\\/.*)?',
    href: '/sidebar',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
    // child: [
    //   {
    //     title: 'Child',
    //     icon: 'child-icon',
    //     href: '/sidebar/child',
    //     regExpForDetermineActivePoint: '^\\/sidebar\\/child(?:\\?|#|\\/|$)',
    //   },
    // ],
  },
  {
    title: 'Multiselect',
    regExpForDetermineActivePoint: '^\\/multiselect(?:\\/.*)?',
    href: '/multiselect',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
  },
  {
    title: 'Datepicker',
    regExpForDetermineActivePoint: '^\\/datepicker(?:\\/.*)?',
    href: '/datepicker',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
  },
  {
    title: 'Table',
    regExpForDetermineActivePoint: '^\\/table(?:\\/.*)?',
    href: '/table',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
  },
  {
    title: 'Modal',
    regExpForDetermineActivePoint: '^\\/modal(?:\\/.*)?',
    href: '/modal',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
  },
  {
    title: 'Chat',
    regExpForDetermineActivePoint: '^\\/chat(?:\\/.*)?',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
    child: [
      {
        title: 'Amin',
        icon: 'child-icon',
        href: '/chat/admin',
        regExpForDetermineActivePoint: '^\\/chat\\/admin(?:\\?|#|\\/|$)',
      },
      {
        title: 'Partner',
        icon: 'child-icon',
        href: '/chat/partner',
        regExpForDetermineActivePoint: '^\\/chat\\/partner(?:\\?|#|\\/|$)',
      },
    ],
  },
  {
    title: 'Dropdown',
    regExpForDetermineActivePoint: '^\\/dropdown(?:\\/.*)?',
    href: '/dropdown',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
  },
  {
    title: 'Button',
    regExpForDetermineActivePoint: '^\\/button(?:\\/.*)?',
    href: '/button',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
  },
  {
    title: 'Toast',
    regExpForDetermineActivePoint: '^\\/toast(?:\\/.*)?',
    href: '/toast',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
  },
  {
    title: 'Badge',
    regExpForDetermineActivePoint: '^\\/badge(?:\\/.*)?',
    href: '/badge',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
  },
  {
    title: 'Card',
    regExpForDetermineActivePoint: '^\\/card(?:\\/.*)?',
    href: '/card',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
  },
  {
    title: 'Inputs',
    regExpForDetermineActivePoint: '^\\/inputs(?:\\/.*)?',
    icon: {
      element: 'span',
      class: 'sidebar-menu-icon',
    },
    child: [
      {
        title: 'Text',
        icon: 'child-icon',
        href: '/inputs/text',
        regExpForDetermineActivePoint: '^\\/inputs\\/text(?:\\?|#|\\/|$)',
      },
      {
        title: 'Checkbox',
        regExpForDetermineActivePoint: '^\\/inputs\\/checkbox(?:\\/.*)?',
        href: '/inputs/checkbox',
        icon: 'child-icon'
      },
      {
        title: 'File',
        regExpForDetermineActivePoint: '^\\/inputs\\/file(?:\\/.*)?',
        href: '/inputs/file',
        icon: 'child-icon'
      },
      {
        title: 'Textarea',
        regExpForDetermineActivePoint: '^\\/inputs\\/textarea(?:\\/.*)?',
        href: '/inputs/textarea',
        icon: 'child-icon'
      },
      {
        title: 'Radio',
        regExpForDetermineActivePoint: '^\\/inputs\\/radio(?:\\/.*)?',
        href: '/inputs/radio',
        icon: 'child-icon'
      },
      {
        title: 'Hidden',
        regExpForDetermineActivePoint: '^\\/inputs\\/hidden(?:\\/.*)?',
        href: '/inputs/hidden',
        icon: 'child-icon'
      }
    ]
  },
];

export default sidebarMenu;
