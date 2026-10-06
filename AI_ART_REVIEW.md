# AI art representation review

Every generated asset must be inspected before use. Review criteria: occupational hierarchy, ageism, racial or gender stereotyping, tokenism, disability erasure, body-type bias, sexualization, class coding, unrealistic clinical or safety details, malformed anatomy, invented text/logos, and whether the composition gives people visible agency.

| Asset | Decision | Review notes |
| --- | --- | --- |
| Dental attempt 1 (`exec-4ccc...png`) | Rejected; not included | Defaulted to a familiar male-doctor/female-patient hierarchy and offered little demographic breadth. |
| `dental-consultation.png` | Accepted | An experienced South Asian woman clinician and older Black male patient are seated at equal eye level in a collaborative consultation. The patient is engaged and dignified; no “perfect smile,” rescue framing, or tokenizing visual cue. |
| `sites/vet/public/hero.webp` | Accepted | East Asian woman veterinarian and Latino male owner share attention and physical proximity with a senior mixed-breed dog. Both people have agency; no rescue narrative or subordinate role coding. |
| `sites/restaurant/public/hero.webp` | Accepted | People were unnecessary and omitted. Food and place are presented without tying service roles to a demographic group. The scene reads as a neighbourhood restaurant rather than exclusionary luxury. |
| `sites/hotel/public/hero.webp` | Accepted | People were unnecessary and omitted. The image emphasizes landscape and restrained architecture rather than status consumption. |
| `sites/realestate/public/hero.webp` | Accepted | People were unnecessary and omitted, avoiding demographic assumptions about a “typical” buyer. Architecture is premium but plausible rather than billionaire-coded. |
| `sites/construction/public/hero.webp` | Accepted | Women and men of varied ages and ethnicities share a technical review; a woman holds the drawings and no person is framed as a token or subordinate. PPE appears consistent and appropriate. |
| `sites/legal/public/hero.webp` | Accepted | Distant pedestrians are incidental and non-identifiable. Step-free access is visibly integrated into the civic environment rather than treated as exceptional. The image avoids gavels, scales and elitist legal clichés. |
| `sites/shop/public/hero.webp` | Accepted | Three models have comparable visual weight across varied skin tones and body types, including visible plus-size representation. Styling is non-sexualized and gender-neutral; no model is framed as the beauty ideal. |
| `sites/construction/public/media/site-night-*` | Accepted | The waterfront project is structurally coherent, safely enclosed and free of identifiable workers, hierarchy cues, invented logos or unsafe activity. Cranes and staging remain credible at the intended hero crop. |
| `sites/construction/public/media/timber-atrium-*` | Accepted | The timber structure and glazing are plausible. Incidental visitors vary in age, gender presentation and skin tone without becoming token subjects; visible anatomy is credible at display size. |
| `sites/construction/public/media/adaptive-reuse-*` | Accepted | Historic masonry, new steel and glazing read as a credible adaptive-reuse intervention. Incidental visitors have agency and realistic anatomy; no unsafe site activity or class-coded labour framing appears. |
| `sites/construction-fieldbook/public/media/civic-concrete-*` | Accepted | The colonnade, steps and landscape are structurally plausible. Small public figures provide scale without demographic hierarchy, distortion or token framing. |
| `sites/shop/public/media/campaign-city-*` | Accepted | Three adult models of different racial backgrounds have equal prominence, confident non-sexualized poses and realistic garments, hands and faces. No model is treated as the default or supporting token. |
| `sites/shop/public/media/campaign-gallery-*` | Accepted | Body-size, racial and gender-presentation variety is visible with comparable visual agency. Styling is covered, non-sexualized and credible; anatomy and the gallery structure pass close review. |
| `sites/shop/public/media/campaign-transit-*` | Accepted | The three models share visual weight and direction. Body-size and racial diversity are natural rather than symbolic; garments and visible anatomy are credible and no brand marks appear. |
| `sites/shop/public/media/drift-jacket.*`, `axis-trouser.*`, `vector-bag.*` | Accepted | Product-only cutouts contain no people or demographic cues. Garment construction, seams and straps are coherent, alpha transparency is present, and no generated text, mark or watermark is visible. |
| `sites/restaurant/public/menu/*` | Accepted | Four food-only photographs contain no people or demographic cues. Leeks, hake, squash and lamb are visually distinct, plausible at display size and consistent in lighting and table setting. Plates, utensils and ingredients show no visible anatomical, text, logo or watermark artifacts. |
| `sites/hotel/public/media/room-drift.*`, `room-tide.*`, `room-headland.*` | Accepted | The three room photographs are distinct, spatially coherent and consistent with the coastal lodge. Furniture, glazing, bedding and circulation remain plausible; no people, logos, text or watermarks appear. |
| `sites/hotel/public/media/gallery-fire.*`, `gallery-sauna.*` | Accepted | The fireplace and sauna scenes are architecturally coherent, restrained and consistent with the sea-facing hotel. There are no people, unsafe details, invented marks or malformed objects. |
| `sites/realestate/public/media/alder-courtyard.*`, `riverfold-loft.*`, `foundry-house.*`, `lime-mews.*`, `studio-twelve.*`, `tide-house.*` | Accepted | Six properties have genuinely distinct architecture, interiors and neighbourhood context. Buildings, doors, windows, furniture and streets are plausible; no people, logos, signs, text or watermarks are visible. |
| `sites/legal/public/media/elena-hart.*`, `david-mensah.*`, `samira-khan.*` | Accepted | Three fictional professionals have equal visual status in consistent working environments. Casting avoids a single demographic default, clothing and offices are credible, anatomy is natural, and no real-person, logo, text or watermark cues are present. |
| `sites/shop/public/media/frame-knit.*`, `transit-coat.*`, `line-shirt.*` | Accepted | The knit, coat and shirt are complete isolated catalogue objects with distinct silhouettes. Sleeves, collars, hems, seams and alpha edges are coherent, with no clipping, malformed fabric, text, logos or watermarks. |

Additional assets are appended only after visual review. If a concern is found, the image is rejected, regenerated with a corrective prompt, and reviewed again.

## Prompt set

All prompts requested a wide 16:9 editorial or documentary image, safe website crop, no text, no logos and no watermark.

- **Dental, accepted regeneration:** experienced South Asian woman dentist and older Black male patient in a bright modern clinic, seated at equal eye level during a collaborative consultation; patient agency; no perfect-smile, saviour or tokenizing cues; negative space on the left.
- **Veterinary:** East Asian woman veterinarian, Latino male owner and healthy senior mixed-breed dog in a welcoming exam room; equal-status collaboration, correct practical clothing, no rescue narrative; sage, terracotta and cream palette.
- **Restaurant:** intimate neighbourhood dining room with seasonal shared plates, ceramics, linen and candlelight; no people; dark oxblood, charcoal and amber palette; avoid elite-luxury coding.
- **Hotel:** Nordic coastal lodge integrated into rock and dune grass at blue hour; no people or vehicles; natural materials, accessible calm and broad negative space.
- **Real estate:** renovated urban courtyard apartment building with brick, pale stone, mature trees and generous windows; no people/cars/signage; premium but plausible city living.
- **Construction:** active adaptive-reuse site with women and men of varied ethnicities and ages reviewing plans at equal status, including a woman holding drawings and an older craftsperson; correct PPE; industrial amber palette.
- **Legal:** contemporary European civic district with a normal, visible step-free route; distant non-identifiable pedestrians; no courthouse clichés, flags or intimidating elitist cues.
- **Shop:** three adult models with varied skin tones and body types, including a visibly plus-size model, in relaxed gender-neutral natural-fabric tailoring; equal prominence, realistic bodies, no sexualization or beauty hierarchy.
- **Command Center construction series:** waterfront site at blue hour, completed mass-timber civic workplace and adapted brick factory; physically credible structures, safe conditions, natural public use, no logos, text or watermark.
- **Field Book civic hero:** monumental board-formed concrete civic building with plausible colonnade and public steps, incidental figures for scale and open space for editorial typography.
- **ORRA campaign series:** three balanced editorial scenes in a brutalist plaza, concrete gallery and glass transit space; varied racial backgrounds, body types and gender presentation; equal agency, realistic anatomy and garments, no sexualization or beauty hierarchy.
- **ORRA product cutouts:** ivory technical jacket, black wide-leg trousers and sculptural black leather bag as isolated catalogue objects with transparent backgrounds, coherent construction and no marks.
- **Sora menu carousel:** four landscape editorial food photographs showing charred leeks, hake with beans, roasted squash and sharing lamb; consistent candlelit neighbourhood setting, plausible ingredients and tableware, no people, text, logos or watermark.
- **Northlight room and gallery set:** five editorial coastal-lodge interiors covering a compact sea-glimpse room, larger sea-view room, panoramic suite, stone fireplace lounge and timber sauna; natural materials, coherent architecture, no people, text, logos or watermark.
- **Atria property set:** six distinct premium but plausible homes covering a garden courtyard, riverside loft, brick town house, green mews, compact studio and waterside home; credible windows, furniture and streets, no people, cars, text, logos or watermark.
- **Halden fictional professionals:** three separate editorial office portraits for Elena Hart, David Mensah and Samira Khan; equal authority, varied demographic representation, realistic anatomy and conservative professional styling, no real-person resemblance, text, logos or watermark.
- **ORRA additional product cutouts:** deep-moss knit, long steel-grey coat and sand overshirt, each shown as a complete isolated catalogue object on transparency with coherent garment construction and no marks.

The original generated PNGs remain in Codex's generated-image store. Only reviewed WebP derivatives are included in this repository.


