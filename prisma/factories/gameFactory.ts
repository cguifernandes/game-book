const popularGames = [
  {
    name: "The Witcher 3: Wild Hunt",
    slug: "the-witcher-3-wild-hunt",
    description:
      "Um RPG de mundo aberto épico onde você joga como Geralt de Rivia, um caçador de monstros profissional. Explore um mundo vasto, complete missões e enfrente criaturas perigosas.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
    releaseDate: new Date("2015-05-19"),
    developer: "CD Projekt RED",
    publisher: "CD Projekt"
  },
  {
    name: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    description:
      "Uma história épica sobre a vida no Velho Oeste americano. Jogue como Arthur Morgan, um fora da lei em fuga, enquanto explora um mundo aberto imersivo.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg",
    releaseDate: new Date("2018-10-26"),
    developer: "Rockstar Games",
    publisher: "Rockstar Games"
  },
  {
    name: "Elden Ring",
    slug: "elden-ring",
    description:
      "Um RPG de ação em mundo aberto desenvolvido pela FromSoftware. Explore as Terras Intermédias, derrote chefes épicos e descubra os segredos deste mundo sombrio.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg",
    releaseDate: new Date("2022-02-25"),
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment"
  },
  {
    name: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    description:
      "Um RPG de ação em primeira pessoa ambientado em Night City, uma megalópole obcecada por poder, glamour e modificações corporais.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.jpg",
    releaseDate: new Date("2020-12-10"),
    developer: "CD Projekt RED",
    publisher: "CD Projekt"
  },
  {
    name: "God of War",
    slug: "god-of-war-2018",
    description:
      "Kratos agora vive como um homem comum no reino dos deuses e monstros nórdicos. Ele deve lutar para sobreviver enquanto ensina seu filho a fazer o mesmo.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r6x.jpg",
    releaseDate: new Date("2018-04-20"),
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment"
  },
  {
    name: "The Last of Us Part II",
    slug: "the-last-of-us-part-ii",
    description:
      "Cinco anos após sua jornada perigosa pelos Estados Unidos pós-pandêmicos, Ellie e Joel se estabeleceram em Jackson, Wyoming.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r6y.jpg",
    releaseDate: new Date("2020-06-19"),
    developer: "Naughty Dog",
    publisher: "Sony Interactive Entertainment"
  },
  {
    name: "Baldur's Gate 3",
    slug: "baldurs-gate-3",
    description:
      "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6nrt.jpg",
    releaseDate: new Date("2023-08-03"),
    developer: "Larian Studios",
    publisher: "Larian Studios"
  },
  {
    name: "Hollow Knight",
    slug: "hollow-knight",
    description:
      "Forge your path through Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7a.jpg",
    releaseDate: new Date("2017-02-24"),
    developer: "Team Cherry",
    publisher: "Team Cherry"
  },
  {
    name: "Celeste",
    slug: "celeste",
    description:
      "A plataforma de escalada de montanha sobre superar seus demônios internos. Ajude Madeline a escalar a montanha Celeste enquanto enfrenta seus medos.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7b.jpg",
    releaseDate: new Date("2018-01-25"),
    developer: "Maddy Makes Games",
    publisher: "Maddy Makes Games"
  },
  {
    name: "Hades",
    slug: "hades",
    description:
      "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rpf.jpg",
    releaseDate: new Date("2020-09-17"),
    developer: "Supergiant Games",
    publisher: "Supergiant Games"
  },
  {
    name: "Stardew Valley",
    slug: "stardew-valley",
    description:
      "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7c.jpg",
    releaseDate: new Date("2016-02-26"),
    developer: "ConcernedApe",
    publisher: "ConcernedApe"
  },
  {
    name: "Portal 2",
    slug: "portal-2",
    description:
      "The single-player portion of Portal 2 introduces a cast of dynamic new characters, a host of fresh puzzle elements, and a much larger set of devious test chambers.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7d.jpg",
    releaseDate: new Date("2011-04-19"),
    developer: "Valve",
    publisher: "Valve"
  },
  {
    name: "Half-Life: Alyx",
    slug: "half-life-alyx",
    description:
      "Set between the events of Half-Life and Half-Life 2, Alyx Vance and her father Eli mount an early resistance to the Combine's brutal occupation of Earth.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7e.jpg",
    releaseDate: new Date("2020-03-23"),
    developer: "Valve",
    publisher: "Valve"
  },
  {
    name: "Disco Elysium",
    slug: "disco-elysium",
    description:
      "Disco Elysium is a groundbreaking role playing game. You're a detective with a unique skill system at your disposal and a whole city block to carve your path across.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg",
    releaseDate: new Date("2019-10-15"),
    developer: "ZA/UM",
    publisher: "ZA/UM"
  },
  {
    name: "Outer Wilds",
    slug: "outer-wilds",
    description:
      "Named Game of the Year 2019 by Giant Bomb, Polygon, Eurogamer, and The Guardian, Outer Wilds is a critically-acclaimed and award-winning open world mystery about a solar system trapped in an endless time loop.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7g.jpg",
    releaseDate: new Date("2019-05-30"),
    developer: "Mobius Digital",
    publisher: "Annapurna Interactive"
  }
]
