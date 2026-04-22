// ISO 3166-1 alpha-2 → alpha-3 lookup, scoped to the dataset's countries.
export const ISO2_TO_ISO3: Record<string, string> = {
  AF:"AFG",AX:"ALA",AL:"ALB",DZ:"DZA",AD:"AND",AO:"AGO",AG:"ATG",AR:"ARG",AM:"ARM",AW:"ABW",AU:"AUS",AT:"AUT",AZ:"AZE",
  BS:"BHS",BH:"BHR",BD:"BGD",BB:"BRB",BY:"BLR",BE:"BEL",BZ:"BLZ",BJ:"BEN",BM:"BMU",BT:"BTN",BQ:"BES",BA:"BIH",BW:"BWA",
  BR:"BRA",VG:"VGB",BG:"BGR",BF:"BFA",BI:"BDI",CV:"CPV",KH:"KHM",CM:"CMR",CA:"CAN",KY:"CYM",CF:"CAF",TD:"TCD",CL:"CHL",
  CN:"CHN",HK:"HKG",MO:"MAC",CO:"COL",KM:"COM",CG:"COG",CR:"CRI",CI:"CIV",HR:"HRV",CU:"CUB",CW:"CUW",CY:"CYP",CZ:"CZE",
  CD:"COD",DK:"DNK",DJ:"DJI",DM:"DMA",DO:"DOM",EC:"ECU",EG:"EGY",SV:"SLV",GQ:"GNQ",ER:"ERI",EE:"EST",SZ:"SWZ",ET:"ETH",
  FO:"FRO",FJ:"FJI",FI:"FIN",FR:"FRA",GA:"GAB",GM:"GMB",GE:"GEO",DE:"DEU",GH:"GHA",GI:"GIB",GR:"GRC",GL:"GRL",GD:"GRD",
  GT:"GTM",GG:"GGY",GN:"GIN",GW:"GNB",GY:"GUY",HT:"HTI",HN:"HND",HU:"HUN",IS:"ISL",IN:"IND",ID:"IDN",IR:"IRN",IQ:"IRQ",
  IE:"IRL",IM:"IMN",IL:"ISR",IT:"ITA",JM:"JAM",JP:"JPN",JE:"JEY",JO:"JOR",KZ:"KAZ",KE:"KEN",KI:"KIR",KP:"PRK",KR:"KOR",
  XK:"XKX",KW:"KWT",KG:"KGZ",LA:"LAO",LV:"LVA",LB:"LBN",LS:"LSO",LR:"LBR",LY:"LBY",LI:"LIE",LT:"LTU",LU:"LUX",MG:"MDG",
  MW:"MWI",MY:"MYS",MV:"MDV",ML:"MLI",MT:"MLT",MH:"MHL",MR:"MRT",MU:"MUS",MX:"MEX",FM:"FSM",MD:"MDA",MC:"MCO",MN:"MNG",
  ME:"MNE",MA:"MAR",MZ:"MOZ",MM:"MMR",NA:"NAM",NR:"NRU",NP:"NPL",NL:"NLD",NZ:"NZL",NI:"NIC",NE:"NER",NG:"NGA",MK:"MKD",
  NO:"NOR",OM:"OMN",PK:"PAK",PW:"PLW",PA:"PAN",PG:"PNG",PY:"PRY",PE:"PER",PH:"PHL",PL:"POL",PT:"PRT",QA:"QAT",RO:"ROU",
  RU:"RUS",RW:"RWA",KN:"KNA",LC:"LCA",VC:"VCT",WS:"WSM",SM:"SMR",ST:"STP",SA:"SAU",SN:"SEN",RS:"SRB",SC:"SYC",SL:"SLE",
  SG:"SGP",SK:"SVK",SI:"SVN",SB:"SLB",SO:"SOM",ZA:"ZAF",SS:"SSD",ES:"ESP",LK:"LKA",SD:"SDN",SR:"SUR",SE:"SWE",CH:"CHE",
  SY:"SYR",TJ:"TJK",TZ:"TZA",TH:"THA",TL:"TLS",TG:"TGO",TO:"TON",TT:"TTO",TN:"TUN",TR:"TUR",TM:"TKM",TV:"TUV",UG:"UGA",
  UA:"UKR",AE:"ARE",GB:"GBR",US:"USA",UY:"URY",UZ:"UZB",VU:"VUT",VE:"VEN",VN:"VNM",YE:"YEM",ZM:"ZMB",ZW:"ZWE",
};

export const isoToFlag = (iso2?: string | null) => {
  if (!iso2) return "🌐";
  return String.fromCodePoint(...iso2.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
};
