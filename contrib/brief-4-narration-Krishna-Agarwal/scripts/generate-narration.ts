import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { diwanIAamFactSheet } from '../content/factsheets/diwan-i-aam';
import { diwanIKhasFactSheet } from '../content/factsheets/diwan-i-khas';
import { lahoriGateFactSheet } from '../content/factsheets/lahori-gate';
import { rangMahalFactSheet } from '../content/factsheets/rang-mahal';
import type { FactSheet, Narration, NarrationKind, Persona } from '../lib/types';

type OutputFile = {
  fileName: string;
  exportName: string;
  narrations: Narration[];
};

const outputDir = join(process.cwd(), 'content', 'narrations');

function narration(
  factSheet: FactSheet,
  persona: Persona,
  kind: NarrationKind,
  sentences: string[]
): Narration {
  return {
    pointId: factSheet.pointId,
    persona,
    lang: 'en',
    kind,
    audioUrl: '',
    durationSec: 0,
    sentences,
    cues: sentences.map(() => 0),
    factSheetId: factSheet.id
  };
}

function fileContent(exportName: string, narrations: Narration[]): string {
  return `import type { Narration } from '../../lib/types';\n\nexport const ${exportName}: Narration[] = ${JSON.stringify(narrations, null, 2)};\n`;
}

const outputs: OutputFile[] = [
  {
    fileName: 'diwan-i-aam.ts',
    exportName: 'diwanIAamNarrations',
    narrations: [
      narration(diwanIAamFactSheet, 'history', 'approach', [
        'Diwan-i-Aam is identified as the Hall of Public Audience of the Red Fort.',
        'Its recorded construction period is AD 1639 to 1648.',
        'The past use of Diwan-i-Aam is recorded as a court.',
        'The Mughal emperors received the general public here.',
        'They also heard complaints here while seated on the throne.',
        'That public role is the central historical fact of this hall.',
        'The hall connected the emperor, the court, and the general public in one recorded setting.',
        'Diwan-i-Aam is also listed as part of the protected Red Fort monument.',
        'Its history is therefore not only the date of construction.',
        'Its history is also the recorded use of the space as a court.',
        'The name Hall of Public Audience explains who came here.',
        'The record of complaints explains why the place mattered in public life.',
        'The throne explains where the emperor sat during that recorded public audience.',
        'Together, these facts make Diwan-i-Aam a courtly public space inside the Red Fort.'
      ]),
      narration(diwanIAamFactSheet, 'architecture', 'approach', [
        'Diwan-i-Aam is recorded as twenty-four point four metres long and twelve point three metres wide.',
        'It is built of red sandstone.',
        'It stands on a one point two metre plinth.',
        'The interior of the hall is three bays deep.',
        'The exterior ornamentation includes columns.',
        'The exterior ornamentation also includes cusped arches.',
        'A marble pavilion is part of the exterior ornamentation.',
        'Pietra dura work is also recorded in the ornamentation.',
        'A central recess is recorded on the east wall of the hall.',
        'A white marble pavilion stands in that central recess.',
        'The white marble pavilion has fluted columns.',
        'The same pavilion has a Bengal roof.',
        'These recorded materials and forms give Diwan-i-Aam its architectural character.'
      ]),
      narration(diwanIAamFactSheet, 'kids', 'approach', [
        'Diwan-i-Aam is the Hall of Public Audience in the Red Fort.',
        'It was built in the period recorded as AD 1639 to 1648.',
        'This place was used as a court.',
        'Mughal emperors received the general public here.',
        'They heard complaints here while seated on the throne.',
        'The hall is made of red sandstone.',
        'It has columns and cusped arches.',
        'It also has a marble pavilion with pietra dura work.',
        'Inside, the hall is three bays deep.',
        'On the east wall, a white marble pavilion stands in a central recess.',
        'That pavilion has fluted columns and a Bengal roof.'
      ]),
      narration(diwanIAamFactSheet, 'history', 'inside', [
        'Inside Diwan-i-Aam, one specific detail to notice is the white marble pavilion in the central recess of the east wall.',
        'The Fact Sheet records that this pavilion has fluted columns and a Bengal roof.',
        'It marks the place connected with the emperor seated on the throne during public audience.'
      ])
    ]
  },
  {
    fileName: 'diwan-i-khas.ts',
    exportName: 'diwanIKhasNarrations',
    narrations: [
      narration(diwanIKhasFactSheet, 'history', 'approach', [
        'Diwan-i-Khas is identified as the Hall of Private Audience of the Red Fort.',
        'Its recorded construction period is AD 1639 to 1648.',
        'The past use of Diwan-i-Khas is recorded as the Hall of Private Audience.',
        'The emperor gave audience to select courtiers and nobles here.',
        'That recorded audience makes the hall different from a public court.',
        'The people named in the Fact Sheet are select courtiers and nobles.',
        'The person giving audience is the emperor.',
        'The place is therefore defined by its private audience role.',
        'Diwan-i-Khas is also listed as part of the protected Red Fort monument.',
        'The hall had two courtyards on its west side.',
        'Both of those courtyards were enclosed by arcaded colonnades.',
        'The Nahr-i-Bihisht ran through the centre of the hall.',
        'These facts keep the history of Diwan-i-Khas tied to its recorded courtly use.',
        'They also tie that history to a protected space inside the Red Fort.'
      ]),
      narration(diwanIKhasFactSheet, 'architecture', 'approach', [
        'Diwan-i-Khas is recorded as twenty-seven point four metres long and twenty point four metres wide.',
        'The exterior ornamentation of Diwan-i-Khas is recorded as pietra dura.',
        'The interior ornamentation is recorded as paintings on the walls.',
        'The hall had two courtyards on its west side.',
        'Both courtyards were enclosed by arcaded colonnades.',
        'The ceiling of Diwan-i-Khas is flat.',
        'That flat ceiling is supported on cusped arches.',
        'The Nahr-i-Bihisht runs through the centre of the hall.',
        'The architecture of Diwan-i-Khas can therefore be described through proportion, ornament, arches, colonnades, and the Nahr-i-Bihisht.',
        'Each of those details comes from the Fact Sheet for this hall.'
      ]),
      narration(diwanIKhasFactSheet, 'kids', 'approach', [
        'Diwan-i-Khas is the Hall of Private Audience in the Red Fort.',
        'It was built in the period recorded as AD 1639 to 1648.',
        'The emperor met select courtiers and nobles here.',
        'The Fact Sheet names those people as select courtiers and nobles.',
        'The hall has a flat ceiling.',
        'The ceiling is supported on cusped arches.',
        'There were two courtyards on the west side.',
        'Those courtyards had arcaded colonnades around them.',
        'The Nahr-i-Bihisht runs through the centre of the hall.',
        'The outside ornamentation is recorded as pietra dura.',
        'The inside ornamentation is recorded as paintings on the walls.'
      ]),
      narration(diwanIKhasFactSheet, 'history', 'inside', [
        'Inside Diwan-i-Khas, one detail to notice is the Nahr-i-Bihisht running through the centre of the hall.',
        'The Fact Sheet records this detail as part of the hall itself.',
        'It sits within the same private audience space where the emperor met select courtiers and nobles.'
      ])
    ]
  },
  {
    fileName: 'rang-mahal.ts',
    exportName: 'rangMahalNarrations',
    narrations: [
      narration(rangMahalFactSheet, 'history', 'approach', [
        'Rang Mahal is located in the Red Fort in Old Delhi.',
        'It is one of the major attractions inside the Red Fort.',
        'Rang Mahal formed part of the harem inside the fort.',
        'It is also known as Imtiyaz Mahal.',
        'During the rule of Shah Jahan, Rang Mahal was known as the Palace of Distinction.',
        'The Fact Sheet records that the interior was once richly painted and decorated.',
        'Some apartments are called Shish Mahal because tiny pieces of mirror cover their ceilings.',
        'The Nahr-i-Bihisht flowed through the centre of the marble palace.',
        'The Nahr-i-Bihisht flowed into a marble basin carved into the floor.',
        'After the British occupied the fort in 1857, Rang Mahal was used briefly as a mess hall.',
        'The historical story of Rang Mahal is therefore tied to its harem role, its names, and its later recorded use.',
        'Those facts place Rang Mahal within the Red Fort and within Old Delhi.'
      ]),
      narration(rangMahalFactSheet, 'architecture', 'approach', [
        'Rang Mahal is located in the Red Fort in Old Delhi.',
        'The Fact Sheet describes it as a marble palace.',
        'Its interior was once richly painted and decorated.',
        'Some apartments of Rang Mahal are called Shish Mahal.',
        'Those apartments have ceilings covered with tiny pieces of mirror.',
        'The Nahr-i-Bihisht flowed through the centre of the marble palace.',
        'The Nahr-i-Bihisht flowed into a marble basin carved into the floor.',
        'The architectural details supported by the Fact Sheet are the marble palace, painted decoration, mirror-covered ceilings, and carved marble basin.',
        'The same facts also support the central placement of the Nahr-i-Bihisht.',
        'Rang Mahal is also known as Imtiyaz Mahal.',
        'Its recorded identity as a major attraction sits alongside these named features.'
      ]),
      narration(rangMahalFactSheet, 'kids', 'approach', [
        'Rang Mahal is inside the Red Fort in Old Delhi.',
        'It was part of the harem inside the fort.',
        'It is also called Imtiyaz Mahal.',
        'During the rule of Shah Jahan, it was known as the Palace of Distinction.',
        'The inside was once richly painted and decorated.',
        'Some rooms are called Shish Mahal.',
        'They are called that because tiny pieces of mirror cover their ceilings.',
        'The Nahr-i-Bihisht flowed through the centre of the marble palace.',
        'The Nahr-i-Bihisht flowed into a marble basin carved into the floor.',
        'After the British occupied the fort in 1857, Rang Mahal was used briefly as a mess hall.'
      ]),
      narration(rangMahalFactSheet, 'history', 'inside', [
        'Inside Rang Mahal, one detail to notice is the marble basin carved into the floor.',
        'The Fact Sheet records that the Nahr-i-Bihisht flowed into this basin.',
        'This detail belongs to the same marble palace whose centre was crossed by the Nahr-i-Bihisht.'
      ])
    ]
  },
  {
    fileName: 'lahori-gate.ts',
    exportName: 'lahoriGateNarrations',
    narrations: [
      narration(lahoriGateFactSheet, 'history', 'approach', [
        'Lahori Gate served as the main entrance of the Red Fort.',
        'It is situated on the western wall of the Red Fort.',
        'The gate received its name because it led toward Lahore.',
        'Lahori Gate is described as a magnificent three-storeyed structure.',
        'Aurangzeb later screened Lahori Gate with a barbican.',
        'The palaces of the Red Fort are approached from Lahori Gate through Chhatta-Chowk.',
        'Chhatta-Chowk is recorded as a roofed passage.',
        'The covered passage from Lahori Gate is flanked by double-storeyed arcaded apartments.',
        'These facts make Lahori Gate the recorded starting point for approaching the palace area.',
        "The historical context in the Fact Sheet is the gate, the direction toward Lahore, and Aurangzeb's later barbican.",
        'The route in the Fact Sheet begins at the main entrance.',
        'It then passes through the roofed passage toward the palaces of the Red Fort.'
      ]),
      narration(lahoriGateFactSheet, 'architecture', 'approach', [
        'Lahori Gate is described as a three-storeyed structure.',
        'The gateway is decorated with square panels.',
        'It is also decorated with rectangular panels.',
        'It is also decorated with cusped arched panels.',
        'The gateway is flanked by semi-octagonal towers.',
        'Those towers are crowned by two open octagonal pavilions.',
        'The gate is clad in red sandstone.',
        'The pavilion roofs use white stone.',
        'Aurangzeb later screened the gate with a barbican.',
        'The covered passage from the gate is flanked by double-storeyed arcaded apartments.',
        'The architectural vocabulary supported by the Fact Sheet includes panels, cusped arches, semi-octagonal towers, octagonal pavilions, red sandstone, white stone, barbican, and arcaded apartments.'
      ]),
      narration(lahoriGateFactSheet, 'kids', 'approach', [
        'Lahori Gate is the main entrance of the Red Fort.',
        'It stands on the western wall of the fort.',
        'It got its name because it led toward Lahore.',
        'The gate is three storeys high.',
        'Aurangzeb later added a barbican in front of it.',
        'From Lahori Gate, people approach the palaces through Chhatta-Chowk.',
        'Chhatta-Chowk is a roofed passage.',
        'The passage has double-storeyed arcaded apartments on its sides.',
        'The gate is covered in red sandstone.',
        'The roofs of the pavilions use white stone.'
      ]),
      narration(lahoriGateFactSheet, 'history', 'inside', [
        'At Lahori Gate, one specific detail to notice is the covered passage called Chhatta-Chowk.',
        'The Fact Sheet records that this roofed passage leads from Lahori Gate toward the palaces.',
        'It is flanked by double-storeyed arcaded apartments.'
      ])
    ]
  }
];

async function main() {
  await mkdir(outputDir, { recursive: true });

  for (const output of outputs) {
    await writeFile(
      join(outputDir, output.fileName),
      fileContent(output.exportName, output.narrations),
      'utf8'
    );
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
