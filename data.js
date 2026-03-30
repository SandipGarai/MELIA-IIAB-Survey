// ============================================================
//  ICAR-IIAB PROJECT & PERSONNEL DATA  —  data.js
//
//  This is the ONLY file you need to edit when projects change.
//  The form and report scripts read from this file automatically.
//
//  HOW TO ADD A PROJECT:
//    Copy any existing entry in the PROJECTS array, paste it,
//    and change the values. Increment the id number.
//
//  HOW TO ADD A PERSON:
//    Add their name (as a string) to the PERSONNEL array.
//    Keep it in the same format: "Dr. First Last"
//
//  Last updated: January 2026
// ============================================================

const ICAR_DATA = {

  INSTITUTE: {
    name:    "ICAR-Indian Institute of Agricultural Biotechnology",
    short:   "ICAR-IIAB",
    city:    "Ranchi",
    nodal:   "Dr. Sandip Garai",
    role:    "Scientist & MELIA Nodal Officer",
    year:    "2025-26"
  },

  // ----------------------------------------------------------
  //  PERSONNEL
  //  All scientists who appear as PI, Co-PI or Associate.
  //  The form autocomplete is built from this list.
  // ----------------------------------------------------------
  PERSONNEL: [
    "Dr. Aderao N. Ganesh",
    "Dr. Amit Kumar",
    "Dr. Arnab Roy Choudhury",
    "Dr. Avinash Pandey",
    "Dr. Biplab Sarkar",
    "Dr. Gayranga Kar",
    "Dr. GVPPS Ravi Kumar",
    "Dr. Jayanta Layek",
    "Dr. Kanaka K.K.",
    "Dr. Kartik Sharma",
    "Dr. Khela Ram Soren",
    "Dr. Kishor U. Tribhuvan",
    "Dr. Madan Kumar",
    "Dr. Nikhil K.C.",
    "Dr. Omkar M. Limbalkar",
    "Dr. P.C. Chandran",
    "Dr. Pravin Purohit",
    "Dr. Rabi S. Pan",
    "Dr. Ramya N.",
    "Dr. Ranjan K. Nayak",
    "Dr. Reena Kumari Kamal",
    "Dr. Sakshi Kaith",
    "Dr. Sandip Garai",
    "Dr. Siddhartha S. Misra",
    "Dr. Soumajit Sarkar",
    "Dr. Soumen Naskar",
    "Dr. Sreenivas Singh",
    "Dr. Subodh Sinha",
    "Dr. Sudhir Kumar",
    "Dr. Sujay B. Kademani",
    "Dr. Sujay Rakshit",
    "Dr. Sujit K. Bishi",
    "Dr. Surjya Kanta Roy",
    "Dr. Suryakant Manik",
    "Dr. Tanmaya K. Sahu",
    "Dr. Uday Kumar",
    "Dr. V.P. Bhadana",
    "Dr. S.K. Lal"
  ],

  // ----------------------------------------------------------
  //  PROJECTS
  //  Fields:
  //    id       — unique identifier, never change once set
  //    title    — full project title
  //    type     — "IP" (Institute Project) or "EFP" (Externally Funded)
  //    funding  — funding agency name
  //    pi       — Principal Investigator (must match PERSONNEL spelling)
  //    copis    — array of Co-PI names (can be empty [])
  // ----------------------------------------------------------
  PROJECTS: [

    // =========================================================
    //  INSTITUTE PROJECTS
    // =========================================================
    {
      id:      "IP-01",
      title:   "Molecular breeding for the development of rice varieties with inbuilt resistance/tolerance to drought, low soil P, and blast",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. V.P. Bhadana",
      copis:   ["Dr. Avinash Pandey", "Dr. Sudhir Kumar", "Dr. Sujay Rakshit"]
    },
    {
      id:      "IP-02",
      title:   "Improvement of rice yield under low light intensity conditions",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Avinash Pandey",
      copis:   ["Dr. V.P. Bhadana", "Dr. Sudhir Kumar", "Dr. Kishor U. Tribhuvan"]
    },
    {
      id:      "IP-03",
      title:   "Molecular mapping and transcript analysis of seed protein content, digestibility and aluminium toxicity in chickpea (Cicer arietinum L.)",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Khela Ram Soren",
      copis:   ["Dr. Sujay Rakshit", "Dr. Tanmaya K. Sahu", "Dr. Sujit K. Bishi"]
    },
    {
      id:      "IP-04",
      title:   "Identification of genes or genomic regions conferring tolerance to aluminium toxicity and moisture deficit stress conditions in Indian Mustard",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Omkar M. Limbalkar",
      copis:   ["Dr. Kishor U. Tribhuvan", "Dr. Nikhil K.C.", "Dr. Kanaka K.K."]
    },
    {
      id:      "IP-05",
      title:   "Nanotechnology-inspired immune-sorting approach of bovine spermatozoa",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Soumen Naskar",
      copis:   ["Dr. Biplab Sarkar", "Dr. Nikhil K.C.", "Dr. Amit Kumar", "Dr. Sakshi Kaith", "Dr. Tanmaya K. Sahu", "Dr. Kanaka K.K.", "Dr. Sandip Garai", "Dr. Aderao N. Ganesh", "Dr. Soumajit Sarkar"]
    },
    {
      id:      "IP-06",
      title:   "Study of meat, milk and fish to detect foodborne bacterial and viral diseases and their anti-microbial resistance profile under one health platform in the Ranchi district of Jharkhand",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Soumajit Sarkar",
      copis:   ["Dr. Nikhil K.C.", "Dr. Kanaka K.K.", "Dr. Sreenivas Singh"]
    },
    {
      id:      "IP-07",
      title:   "Genomic Exploration of lesser-known chicken population of Jharkhand",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Kanaka K.K.",
      copis:   ["Dr. Soumen Naskar", "Dr. Tanmaya K. Sahu", "Dr. Sandip Garai", "Dr. Amit Kumar", "Dr. Omkar M. Limbalkar", "Dr. Reena Kumari Kamal", "Dr. P.C. Chandran", "Dr. Pravin Purohit"]
    },
    {
      id:      "IP-08",
      title:   "Formulation and evaluation of nano-inspired mineral mixture for improving productivity and gut health in livestock",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Aderao N. Ganesh",
      copis:   ["Dr. Biplab Sarkar", "Dr. Nikhil K.C.", "Dr. Amit Kumar", "Dr. Soumajit Sarkar", "Dr. Soumen Naskar", "Dr. Kanaka K.K."]
    },
    {
      id:      "IP-09",
      title:   "Decipher the role of tetrathionate respiration on the colonization and virulence of Salmonella typhimurium",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Nikhil K.C.",
      copis:   ["Dr. Aderao N. Ganesh", "Dr. Kanaka K.K.", "Dr. Amit Kumar", "Dr. Soumajit Sarkar"]
    },
    {
      id:      "IP-10",
      title:   "Effect of Ice recrystallization inhibitors on Cryopreservation of Black Bengal buck semen",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Amit Kumar",
      copis:   ["Dr. Aderao N. Ganesh", "Dr. Nikhil K.C.", "Dr. Reena Kumari Kamal"]
    },
    {
      id:      "IP-11",
      title:   "Evaluating the nano-inspired degradation of aquatic pollutants with special reference to jute retting and Lac dye waste-water",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Biplab Sarkar",
      copis:   ["Dr. Ranjan K. Nayak", "Dr. Gayranga Kar", "Dr. Arnab Roy Choudhury"]
    },
    {
      id:      "IP-12",
      title:   "Deciphering the role of microbiome including extremophiles in water bodies and surrounding phylloplane in coal mining areas in the perspective of intensive cage aquaculture system",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Biplab Sarkar",
      copis:   []
    },
    {
      id:      "IP-13",
      title:   "Understanding the biochemical and molecular regulation of L-DOPA and tannins biosynthesis in faba bean (Vicia faba L.)",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Sujit K. Bishi",
      copis:   ["Dr. V.P. Bhadana", "Dr. S.K. Lal", "Dr. Nikhil K.C.", "Dr. Rabi S. Pan", "Dr. Subodh Sinha"]
    },
    {
      id:      "IP-14",
      title:   "Understanding the Morpho-Physiology and Molecular Mechanism of seed shattering in grain Amaranth (Amaranthus Spp.)",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Madan Kumar",
      copis:   ["Dr. Avinash Pandey", "Dr. Sujit K. Bishi", "Dr. S.K. Lal"]
    },
    {
      id:      "IP-15",
      title:   "Effect of different land use systems and management practices on microbial dynamics, soil health and carbon sequestration in acidic soil",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Jayanta Layek",
      copis:   ["Dr. Kartik Sharma", "Dr. Madan Kumar"]
    },
    {
      id:      "IP-16",
      title:   "Identification of suitable mustard cultivars and standardization of management practices for enhancing phosphorous use efficiency in rice-fallow",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Kartik Sharma",
      copis:   ["Dr. Jayanta Layek", "Dr. Sujay B. Kademani"]
    },
    {
      id:      "IP-17",
      title:   "Exploring the influence of temperature and water activity on the growth, sporulation and Aflatoxin production of Aspergillus spp. and bioprospecting of associated genes",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Suryakant Manik",
      copis:   ["Dr. Khela Ram Soren", "Dr. Sujit K. Bishi", "Dr. Tanmaya K. Sahu"]
    },
    {
      id:      "IP-18",
      title:   "Establishment of information resource and prediction servers for the genes related to yield traits, biotic stress, and abiotic stress in agriculturally important crops",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Tanmaya K. Sahu",
      copis:   ["Dr. Khela Ram Soren", "Dr. Kishor U. Tribhuvan", "Dr. Suryakant Manik", "Dr. Sandip Garai"]
    },
    {
      id:      "IP-19",
      title:   "Quantifying gaps for sustaining agricultural production and assessing perception of biotechnology",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Sujay B. Kademani",
      copis:   ["Dr. Khela Ram Soren", "Dr. Kartik Sharma", "Dr. Suryakant Manik", "Dr. Sandip Garai"]
    },
    {
      id:      "IP-20",
      title:   "Creation of variability, genome analysis and identification of genotypes/QTL for trait of importance in Winged bean",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Kishor U. Tribhuvan",
      copis:   ["Dr. Sudhir Kumar", "Dr. Avinash Pandey"]
    },
    {
      id:      "IP-21",
      title:   "Investigating the role of purine degrading pathway genes of hemibiotroph fungal pathogens during host-pathogen interaction and their potential to confer disease resistance in maize",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. S.K. Lal",
      copis:   ["Dr. Sudhir Kumar", "Dr. Madan Kumar", "Dr. Sujit K. Bishi"]
    },
    {
      id:      "IP-22",
      title:   "Development of a high-quality reference genome assembly for Chhotanagpuri sheep: Enabling unbiased genomic studies in Indian sheep",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Soumen Naskar",
      copis:   ["Dr. Kanaka K.K.", "Dr. GVPPS Ravi Kumar", "Dr. Siddhartha S. Misra"]
    },
    {
      id:      "IP-23",
      title:   "Enhancing sheep wool fibre characteristics by coating spider silk like nano formulation",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Sakshi Kaith",
      copis:   ["Dr. Nikhil K.C.", "Dr. Aderao N. Ganesh", "Dr. Soumen Naskar"]
    },
    {
      id:      "IP-24",
      title:   "Genetic and Genomic Approaches for Enhancing Nodulation, Tuberization and Dual-Purpose Traits in Winged Bean",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Sudhir Kumar",
      copis:   ["Dr. Avinash Pandey", "Dr. Aderao N. Ganesh", "Dr. Madan Kumar", "Dr. Tanmaya K. Sahu"]
    },
    {
      id:      "IP-25",
      title:   "Modification of Spodoptera litura Nuclear Polyhedrosis Virus (SpltNPV) Genome for UV resistance and Development of Nanoparticle Formulation for Effective Pest Management",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Ramya N.",
      copis:   ["Dr. Biplab Sarkar", "Dr. Suryakant Manik", "Dr. Tanmaya K. Sahu"]
    },
    {
      id:      "IP-26",
      title:   "Investigating the Role of Wax worm Galleria mellonella in Plastic Degradation",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Ramya N.",
      copis:   ["Dr. Sujay Rakshit", "Dr. Sakshi Kaith", "Dr. Sujit K. Bishi"]
    },
    {
      id:      "IP-27",
      title:   "Nano-delivery of essential nutrients in planktons and deciphering the molecular basis of its impact on growth performance and immune response of larval and post-larval stages of Indian Major Carps (IMCs)",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Biplab Sarkar",
      copis:   ["Dr. Aderao N. Ganesh"]
    },
    {
      id:      "IP-28",
      title:   "Artificial Intelligence driven monitoring and mitigation strategies of blast in rice",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Sandip Garai",
      copis:   ["Dr. Suryakant Manik", "Dr. Tanmaya K. Sahu", "Dr. Omkar M. Limbalkar", "Dr. Kartik Sharma"]
    },
    {
      id:      "IP-29",
      title:   "Identification and functional validation of host negative regulators for Banded leaf and sheath blight disease in tropical maize",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. S.K. Lal",
      copis:   ["Dr. Sudhir Kumar", "Dr. Madan Kumar", "Dr. Suryakant Manik", "Dr. Tanmaya K. Sahu"]
    },
    {
      id:      "IP-30",
      title:   "Identifying the best practices, assessing the convergence and impact of outreach programmes of ICAR-IIAB",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Sujay B. Kademani",
      copis:   ["Dr. Soumen Naskar", "Dr. Khela Ram Soren", "Dr. Surjya Kanta Roy", "Dr. Uday Kumar", "Dr. Jayanta Layek", "Dr. Kartik Sharma"]
    },
    {
      id:      "IP-31",
      title:   "Unravelling host range and virulence markers in lumpy skin disease virus through genomic insights",
      type:    "IP",
      funding: "ICAR",
      pi:      "Dr. Soumajit Sarkar",
      copis:   ["Dr. Kanaka K.K.", "Dr. Sreenivas Singh"]
    },

    // =========================================================
    //  EXTERNALLY FUNDED PROJECTS
    // =========================================================
    {
      id:      "EFP-01",
      title:   "Gene editing and engineering of mediator subunit Med15 to modulate grain size/weight trait",
      type:    "EFP",
      funding: "DBT",
      pi:      "Dr. V.P. Bhadana",
      copis:   []
    },
    {
      id:      "EFP-02",
      title:   "Design and development of novel magnetic nanoparticles and its employment for sex-sorting of bovine spermatozoa",
      type:    "EFP",
      funding: "ANRF",
      pi:      "Dr. Soumen Naskar",
      copis:   []
    },
    {
      id:      "EFP-03",
      title:   "Developing transgene-free high-yielding and climate-resilient tropical maize genotypes",
      type:    "EFP",
      funding: "DBT",
      pi:      "Dr. S.K. Lal",
      copis:   []
    },
    {
      id:      "EFP-04",
      title:   "Selective Meiotic Aptamer Regulated Targeting for Inbreeding (SMART-In): Accelerating laboratory animal isogenicity",
      type:    "EFP",
      funding: "ANRF",
      pi:      "Dr. Kanaka K.K.",
      copis:   []
    },
    {
      id:      "EFP-05",
      title:   "Molecular mapping of gene(s) or genomic regions associated with tolerance to aluminum toxicity and drought stress conditions in Indian mustard (Brassica juncea (L.) Czern.)",
      type:    "EFP",
      funding: "ANRF",
      pi:      "Dr. Omkar M. Limbalkar",
      copis:   []
    },
    {
      id:      "EFP-06",
      title:   "Development of Climate Resilient Farming System Models in Jharkhand for Food and Nutritional Security and Enhancing Soil Health",
      type:    "EFP",
      funding: "RKVY",
      pi:      "Dr. Jayanta Layek",
      copis:   []
    },
    {
      id:      "EFP-07",
      title:   "Development of a small-scale green nanoparticles production unit for protecting important pulses and oilseed crops in Jharkhand: Its extensive demonstrations and dissemination in farmer's field",
      type:    "EFP",
      funding: "RKVY",
      pi:      "Dr. Biplab Sarkar",
      copis:   []
    },
    {
      id:      "EFP-08",
      title:   "Dissemination of Quality Seed of Improved Varieties of Pulses in Jharkhand and Feed Back Based Genetic Improvement",
      type:    "EFP",
      funding: "RKVY",
      pi:      "Dr. Sudhir Kumar",
      copis:   []
    },
    {
      id:      "EFP-09",
      title:   "A Decision-Support Framework for Sustainable Farming and Market Linkages in Jharkhand",
      type:    "EFP",
      funding: "RKVY",
      pi:      "Dr. Sandip Garai",
      copis:   []
    },
    {
      id:      "EFP-10",
      title:   "Pilot project for Crop Diversification",
      type:    "EFP",
      funding: "IIFSR, Modipuram",
      pi:      "Dr. Jayanta Layek",
      copis:   []
    }
  ]
};
