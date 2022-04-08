export default [
  {
    name: 'Quick Teleport',
    dataSource: null,
    variables: [
      'location',
      'locationDisplayName',
      'player',
    ],
    commands: [
      {
        shouldWait: false,
        command: 'title @a times 10 200 10',
      },
      {
        shouldWait: false,
        command: 'title @a title {"text":"Teleporting to <%locationDisplayName%>!", "color":"aqua"}',
      },
      {
        shouldWait: false,
        command: 'title @a subtitle {"text":"10", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'title @a subtitle {"text":"9", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'title @a subtitle {"text":"8", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'title @a subtitle {"text":"7", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'title @a subtitle {"text":"6", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'title @a subtitle {"text":"5", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'title @a subtitle {"text":"4", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'title @a subtitle {"text":"3", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'title @a subtitle {"text":"2", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'title @a subtitle {"text":"1", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'mvtp <%player%> <%location%>',
      },
      {
        shouldWait: false,
        command: 'title @a subtitle {"text":"0", "color":"gold"}',
      },
      {
        shouldWait: true,
        command: 'tpall <%player%>',
      },
    ],
  },
];
