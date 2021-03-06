import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of as ObservableOf, BehaviorSubject, from } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

import { PlaylistService } from './playlist.service';
import { Channel } from './channel.model';
import { Track } from './track.model';

//#region
const ChannelListMock = [{"channel_id":73,"channel_key":"straightahead","track":{"display_artist":"Three Voices","display_title":"All the Things You Are (feat. Kim Pensyl)","id":141423}},{"channel_id":74,"channel_key":"bebop","track":{"display_artist":"Al Cohn","display_title":"Jane Street","id":6573}},{"channel_id":75,"channel_key":"classicjazz","track":{"display_artist":"Kid Chocolate","display_title":"Wild Man Blues","id":36172}},{"channel_id":76,"channel_key":"swingnbigband","track":{"display_artist":"Benny Goodman","display_title":"One O'Clock Jump","id":2880269}},{"channel_id":77,"channel_key":"hardbop","track":{"display_artist":"Sonny Rollins","display_title":"Kiss And Run","id":1068}},{"channel_id":78,"channel_key":"cooljazz","track":{"display_artist":"Barney Kessel, Shelly Manne & Ray Brown","display_title":"I'm Afraid The Masquerade Is Over","id":873849}},{"channel_id":79,"channel_key":"vocaljazz","track":{"display_artist":"Lorraine Feather","display_title":"I Thought You Did","id":649354}},{"channel_id":80,"channel_key":"latinjazz","track":{"display_artist":"Afro Latin Sound Machine Ft Johnny Rodriguez","display_title":"Talk About My Baby","id":1275716}},{"channel_id":81,"channel_key":"guitarjazz","track":{"display_artist":"Jeff McLaughlin","display_title":"Journey To The East","id":9297}},{"channel_id":82,"channel_key":"mellowjazz","track":{"display_artist":"Jim Rotondi","display_title":"I Wish I Knew","id":902059}},{"channel_id":83,"channel_key":"pianojazz","track":{"display_artist":"Tony Thomas","display_title":"Big House","id":31013}},{"channel_id":84,"channel_key":"smoothjazz","track":{"display_artist":"Brian Clay","display_title":"Honey Grove Lane","id":752304}},{"channel_id":85,"channel_key":"bossanova","track":{"display_artist":"Laurindo Almeida","display_title":"O'Barquinho","id":67801}},{"channel_id":86,"channel_key":"smoothuptempo","track":{"display_artist":"Chuck Loeb","display_title":"Good To Go","id":1424}},{"channel_id":87,"channel_key":"fusionlounge","track":{"display_artist":"Trio Eletrico","display_title":"Wandance Paris","id":69489}},{"channel_id":89,"channel_key":"blues","track":{"display_artist":"Johnny Shines","display_title":"I Will Be Kind to You","id":928386}},{"channel_id":95,"channel_key":"sinatrastyle","track":{"display_artist":"Ella Fitzgerald & Joe Pass","display_title":"You're Blase","id":88121}},{"channel_id":96,"channel_key":"vocallegends","track":{"display_artist":"Dean Martin","display_title":"Sway","id":41159}},{"channel_id":97,"channel_key":"pianotrios","track":{"display_artist":"Glenn Zaleski","display_title":"Body and Soul","id":962861}},{"channel_id":98,"channel_key":"timelessclassics","track":{"display_artist":"Bob Howard & His Orchestra","display_title":"It's Unbelievable","id":61223}},{"channel_id":99,"channel_key":"smoothvocals","track":{"display_artist":"Bart Brandjes","display_title":"When It Comes To Loving You","id":596332}},{"channel_id":102,"channel_key":"saxophonejazz","track":{"display_artist":"Scott Hamilton","display_title":"Something For Red","id":1218349}},{"channel_id":103,"channel_key":"trumpetjazz","track":{"display_artist":"Tom Harrell","display_title":"Emergence","id":769203}},{"channel_id":112,"channel_key":"pariscafe","track":{"display_artist":"Hot Club de Norvege","display_title":"Baguette","id":1226948}},{"channel_id":113,"channel_key":"gypsyjazz","track":{"display_artist":"Caravan Gypsy Swing Ensemble","display_title":"Blue Drag","id":779247}},{"channel_id":115,"channel_key":"currentjazz","track":{"display_artist":"Haven Street","display_title":"Heavy Skies","id":2891702}},{"channel_id":116,"channel_key":"smoothjazz247","track":{"display_artist":"Ray Obiedo","display_title":"A Thousand Reasons","id":870388}},{"channel_id":134,"channel_key":"bassjazz","track":{"display_artist":"Niels Pedersen & Sam Jones","display_title":"Miss Morgan","id":769022}},{"channel_id":135,"channel_key":"vibraphonejazz","track":{"display_artist":"Chick Corea & Gary Burton","display_title":"Strange Meadow Lark","id":227190}},{"channel_id":170,"channel_key":"smoothlounge","track":{"display_artist":"KoolSax","display_title":"Beyond the Sunset","id":754349}},{"channel_id":196,"channel_key":"smoothbossanova","track":{"display_artist":"Jojo Effect","display_title":"Breakout Bossa","id":774598}},{"channel_id":199,"channel_key":"mellowsmoothjazz","track":{"display_artist":"Igor","display_title":"Shelly Beach","id":24758}},{"channel_id":200,"channel_key":"bluesrock","track":{"display_artist":"John Mayall","display_title":"John Lee Boogie","id":688184}},{"channel_id":300,"channel_key":"flamencojazz","track":{"display_artist":"Nick Perrin Flamenco Jazz Quartett","display_title":"Lagartija","id":419482}},{"channel_id":301,"channel_key":"davekoz","track":{"display_artist":"Brian Simpson (featuring Maysa)","display_title":"Rio Sway","id":942222}},{"channel_id":328,"channel_key":"jazzballads","track":{"display_artist":"Joe Magnarelli","display_title":"Old Folks","id":32272}},{"channel_id":412,"channel_key":"mellowpianojazz","track":{"display_artist":"Ryan Burns","display_title":"Entomology","id":81622}},{"channel_id":413,"channel_key":"modernbigband","track":{"display_artist":"Phil Woods","display_title":"Greenhouse","id":1261437}}];
const ChannelMock = {"channel_id":96,"expires_on":"2018-09-09T13:35:41-04:00","routine_id":294,"tracks":[{"artist":{"asset_url":null,"id":6041,"images":{},"name":"Anita O'Day"},"artists":[{"id":6041,"images":{},"name":"Anita O'Day","slug":"anita-oday","type":"artist"}],"asset_url":"//cdn-images.audioaddict.com/7/3/7/6/2/1/737621c4ddb17e0bbbf25fc24cc535ac.jpg","content":{"interactive":false,"length":128.242,"offset":null,"assets":[{"content_format_id":6,"content_quality_id":2,"size":1037937,"url":"//content.audioaddict.com/prd/0/2/c/5/2/81f8bb69b444c179196c0d389760fb9c5a3.mp4?purpose=playback&audio_token=c5a7dbacecf6aea002ff379da68061ae&network=jazzradio&device=chrome_69_mac_os_x_10_13_4&exp=2018-09-09T17:35:40Z&auth=1592811978bdd0f83c8be1ef3962111fe3c23701"}]},"content_accessibility":1,"details_url":"http://www.jazzradio.com/tracks/32128/vocallegends","display_artist":"Anita O'Day","display_title":"I Could Write a Book","id":32128,"images":{"default":"//cdn-images.audioaddict.com/7/3/7/6/2/1/737621c4ddb17e0bbbf25fc24cc535ac.jpg{?size,height,width,quality,pad}"},"is_show_asset":false,"isrc":"","length":131,"mix":false,"parental_advisory":null,"preview":null,"preview_accessibility":0,"release":null,"release_date":null,"retail":{},"retail_accessibility":0,"title":"I Could Write a Book","track":"Anita O'Day - I Could Write a Book","track_container_id":null,"version":"","votes":{"up":74,"down":10,"who_upvoted":{"size":3235,"hashes":30,"seed":1536162748,"bits":[129548037,808382976,1827961021,590883245,3884641471,2993303640,704072017,1755293364,1454741005,3355535024,3155451094,3114792652,1675993395,2217640313,1330035114,2547613453,4059903087,597374580,2318242183,4272287808,254562533,1360142757,1167447248,2776734166,3916905943,1701704243,2243554953,3899519999,4001253351,1758325236,3106343296,714659986,2019068571,3649807643,3929595831,2419022848,1441939935,1247722021,1972428074,953978280,122193671,2684729152,349920665,1368813670,2496322008,3297431875,3558336885,2013554535,245990305,708223814,25268035,1630020361,2072802784,411207555,1576187191,3083826244,1560122770,2647580329,803178535,535129521,1570353165,3645898166,2050509507,2522393523,3531641772,825042629,434004912,904008739,1372327405,451977565,2691623992,4162364940,1711088266,782370466,3967139144,746596146,2446762691,39880466,1453271807,1386709192,4094656430,1490382841,4209650001,2997660737,3215958421,1306927643,3947955,3090386159,1133481081,1804292573,3644090304,1105558723,23405283,4215514782,3208050150,3529628724,1210562538,3188520051,2092691810,3625040429,3807381250,6],"items":null},"who_downvoted":{"size":475,"hashes":30,"seed":1536162748,"bits":[174010483,3491224110,3573842664,519123708,511182462,4063020432,3675441403,3359580547,3226835171,2945589842,8536074,2834181721,577520420,1878924426,115144774],"items":null}},"waveform_url":"//waveform.audioaddict.com/prd/7/d/d/9/2/e304d3a211a38bc6ea218f54f8d18644ea2.json"},{"artist":{"asset_url":null,"id":19008,"images":{},"name":"Quincy Jones & Ella Fitzgerald"},"artists":[{"id":19008,"images":{},"name":"Quincy Jones & Ella Fitzgerald","slug":"quincy-jones-ella-fitzgerald","type":"artist"}],"asset_url":null,"content":{"interactive":false,"length":241.753,"offset":null,"assets":[{"content_format_id":6,"content_quality_id":2,"size":1955722,"url":"//content.audioaddict.com/prd/1/b/b/0/3/b0647dc9223e9fea3eae79bbdbb58421c20.mp4?purpose=playback&audio_token=c5a7dbacecf6aea002ff379da68061ae&network=jazzradio&device=chrome_69_mac_os_x_10_13_4&exp=2018-09-09T17:35:40Z&auth=1592811978bdd0f83c8be1ef3962111fe3c23701"}]},"content_accessibility":1,"details_url":"http://www.jazzradio.com/tracks/29942/vocallegends","display_artist":"Quincy Jones & Ella Fitzgerald","display_title":"I'm Beginning to See the Light","id":29942,"images":{},"is_show_asset":false,"isrc":null,"length":243,"mix":false,"parental_advisory":null,"preview":null,"preview_accessibility":0,"release":null,"release_date":null,"retail":{},"retail_accessibility":0,"title":"I'm Beginning to See the Light","track":"Quincy Jones & Ella Fitzgerald - I'm Beginning to See the Light","track_container_id":null,"version":null,"votes":{"up":123,"down":14,"who_upvoted":{"size":5349,"hashes":30,"seed":1536162748,"bits":[3076628411,132357409,2368606955,3018035803,201481007,559523049,2269072272,3811157057,967366285,4036408752,1662297403,1734934559,609547397,1734620943,1523964876,3993776798,859719173,2190066723,3278861623,4154860698,496334506,4181577636,351363990,610273059,687581152,1132476388,1769994869,759737531,2187567582,2003668750,1205152713,2937218404,3741588475,876942209,1168923043,4086614371,3715846175,2968130999,1805268756,3603006253,532850286,2334257404,4084041724,4252221599,785523470,1704408294,3302451110,4047140100,2295944785,2496855070,3894093823,700937635,1149705234,3024017601,407163476,927362826,2249473455,2568906627,1170144413,1563425991,220559288,2829761898,2570334521,894704122,1807752267,2185534404,95768391,1992117077,208860695,1955882031,3032780640,3822817123,2391966069,3054374721,4225773817,929960545,2433228610,458416477,1697072616,2972199253,4061810044,2278254833,3673207845,1335711510,1562651755,3647681533,800019733,1304428746,3868781008,3654359256,4098785490,3784024244,1261185995,2736151169,2516132123,2231709883,3873866167,3299233669,294929174,341473529,572601544,4106808583,821501492,2662546277,818504038,914587117,303424692,1341012222,2500807044,1947803668,2768752294,3249035896,597404305,1245082982,3952148045,1218488741,3339803593,2277741857,2168163969,1026868549,2697338238,2630280646,870320748,2677017597,2862497248,1388158539,1435220546,384767411,4106152156,4123917588,972840611,690860600,659471430,1844547243,414761790,1032108064,3727507372,2066598007,1900668634,1885159831,1450728855,3684506903,1193353697,3915534721,3112545521,571758758,2787178528,2281746422,279590596,4255812713,1359166080,4262460254,368614891,865217998,815299441,903516671,3202053890,2548213318,429641545,1702479576,1222755429,841723225,4209723679,1317254652,2944163199,2935958434,1501916816,20],"items":null},"who_downvoted":{"size":647,"hashes":30,"seed":1536162748,"bits":[371810669,1073867332,609517330,1253536567,209091454,2883724834,3424040936,2773718677,2953156851,1441240677,1467713252,3994372944,3262696945,1550048987,1257088035,3253560816,1209208992,987013129,23931275,2189654663,99],"items":null}},"waveform_url":"//waveform.audioaddict.com/prd/6/8/d/f/e/a0ba64fbfeae59fb06700f257cc5a854394.json"},{"artist":{"asset_url":null,"id":7061,"images":{},"name":"Helen Forrest"},"artists":[{"id":7061,"images":{},"name":"Helen Forrest","slug":"helen-forrest","type":"artist"}],"asset_url":"//cdn-images.audioaddict.com/e/b/6/7/e/d/eb67ed7ed7f9f8a9e7600089afdef555.jpg","content":{"interactive":false,"length":196.878,"offset":null,"assets":[{"content_format_id":6,"content_quality_id":2,"size":1592970,"url":"//content.audioaddict.com/prd/3/b/b/6/0/2018dbb380ab092ef4149e3cb4cd7d82afe.mp4?purpose=playback&audio_token=c5a7dbacecf6aea002ff379da68061ae&network=jazzradio&device=chrome_69_mac_os_x_10_13_4&exp=2018-09-09T17:35:40Z&auth=1592811978bdd0f83c8be1ef3962111fe3c23701"}]},"content_accessibility":1,"details_url":"http://www.jazzradio.com/tracks/18003/vocallegends","display_artist":"Helen Forrest","display_title":"Perfidia (with Benny Goodman)","id":18003,"images":{"default":"//cdn-images.audioaddict.com/e/b/6/7/e/d/eb67ed7ed7f9f8a9e7600089afdef555.jpg{?size,height,width,quality,pad}"},"is_show_asset":false,"isrc":"","length":200,"mix":false,"parental_advisory":null,"preview":null,"preview_accessibility":0,"release":null,"release_date":null,"retail":{},"retail_accessibility":0,"title":"Perfidia (with Benny Goodman)","track":"Helen Forrest - Perfidia (with Benny Goodman)","track_container_id":null,"version":"","votes":{"up":99,"down":15,"who_upvoted":{"size":4314,"hashes":30,"seed":1536162748,"bits":[2071770701,3853682295,1419091421,771941802,1305296108,1680194610,2909066613,404984512,56392574,4039829329,406917323,226611023,3530492258,3354692216,2278780790,3183142558,425033375,945225115,705219704,3194922132,522667558,1051019633,3225020283,579478367,2967795496,547500934,2473485971,1123864689,830527159,3062075056,2474241144,2112802990,3903329219,2365051963,2949778895,1312193146,627320675,753191410,1317797153,470998936,3968179037,1661960695,2669836871,3842346783,131407115,3071501888,2494969756,2282170714,1969464472,3072392307,183091314,1936063147,138865830,3936835004,2334731698,2000876922,91836457,1597951500,3743020322,3026314949,2030934314,2009347123,2043297980,1390755469,3050777138,2518865359,3913098736,4023663459,3116088345,3084251080,348700371,642801509,3928698244,1350119368,4216325081,4234210101,1810834415,395105803,3240253729,2512711544,3134424273,1129876011,3051584971,1869968521,3433703214,3588679366,3125886287,2693144651,139002024,3309041406,1760463494,2118270370,3950228281,2939438973,2854528844,3318567949,2381836932,432087237,1296615695,2036285542,957477829,3025559607,2493697794,3288323610,3034022099,2253447321,15895553,1880674941,4004670905,3101263960,3255627554,309944144,2488019678,3077732399,705071603,3462688523,1508907972,3410305101,1318916376,706550031,4268601074,3307796285,693745883,1655593859,2587392515,1424133657,687899234,2021248347,194553890,2065779557,4241882631,3852649240,657061026,2160069172,42750262],"items":null},"who_downvoted":{"size":691,"hashes":30,"seed":1536162748,"bits":[1868221529,620098721,635633669,894280357,104654244,4246173226,3550063009,4118918305,4250272880,1258870464,3376783632,432209424,203286333,2243254181,1353167234,3608674766,1762859056,3930546099,4060619881,2018995611,1135553354,235196],"items":null}},"waveform_url":"//waveform.audioaddict.com/prd/b/c/f/4/b/5dd5075b886818b2b77e4fcb810bdfc1e67.json"},{"artist":{"asset_url":null,"id":6041,"images":{},"name":"Anita O'Day"},"artists":[{"id":6041,"images":{},"name":"Anita O'Day","slug":"anita-oday","type":"artist"}],"asset_url":"//cdn-images.audioaddict.com/4/0/4/6/3/b/40463b2343a2ff66cabe8ebba5fab71b.jpg","content":{"interactive":false,"length":142.195,"offset":null,"assets":[{"content_format_id":6,"content_quality_id":2,"size":1150689,"url":"//content.audioaddict.com/prd/6/d/6/e/b/d0d71cb9cf679bae93363d6d4e34f164255.mp4?purpose=playback&audio_token=c5a7dbacecf6aea002ff379da68061ae&network=jazzradio&device=chrome_69_mac_os_x_10_13_4&exp=2018-09-09T17:35:40Z&auth=1592811978bdd0f83c8be1ef3962111fe3c23701"}]},"content_accessibility":1,"details_url":"http://www.jazzradio.com/tracks/31944/vocallegends","display_artist":"Anita O'Day","display_title":"I Get A Kick Out Of You","id":31944,"images":{"default":"//cdn-images.audioaddict.com/4/0/4/6/3/b/40463b2343a2ff66cabe8ebba5fab71b.jpg{?size,height,width,quality,pad}"},"is_show_asset":false,"isrc":"DKAAS9600313","length":146,"mix":false,"parental_advisory":null,"preview":null,"preview_accessibility":0,"release":null,"release_date":null,"retail":{},"retail_accessibility":0,"title":"I Get A Kick Out Of You","track":"Anita O'Day - I Get A Kick Out Of You","track_container_id":null,"version":"","votes":{"up":64,"down":9,"who_upvoted":{"size":2804,"hashes":30,"seed":1536162748,"bits":[2676871570,3523614586,2470556382,3813653384,3485614108,3790562406,3851110846,378395271,660313664,966529749,665466341,2496770785,4000990444,1972207682,1003206689,2145504044,2123395599,2560094096,1212333637,2672705911,3333357969,1930287395,2177735902,2968841069,2104718780,2872254514,258662525,3274329191,2290077487,60704173,1302269731,462179285,1728693764,3209523755,3258058554,2720102982,2569586912,472406463,642842930,328889911,1233897620,3189168745,1462217254,2648478916,58652039,1985490643,4115465181,303766012,792335067,1306862921,51989494,185801005,2546062520,1196804305,1309244982,3756885100,2683831776,3241222092,3170748177,905356055,1378530702,128721102,250249458,1314633744,1338096970,1473446808,4147955176,3681750481,4038058026,16039307,2755094454,3297822202,362295362,332954537,3849504318,1712190499,646406767,3806505051,2660204548,2212642000,3712040643,4257524341,226187909,2656001883,1234260744,1390866285,1137287843,422687],"items":null},"who_downvoted":{"size":432,"hashes":30,"seed":1536162748,"bits":[271342491,1632922605,1560907403,805943626,560335966,1556864247,2517501750,1876585005,3045083072,2723447866,1480814752,3860128823,2589004577,48472],"items":null}},"waveform_url":"//waveform.audioaddict.com/prd/8/e/a/1/c/8c4eaea9a4f674399df84d109694b171577.json"},{"artist":{"asset_url":null,"id":8823,"images":{},"name":"Lou Rawls"},"artists":[{"id":8823,"images":{},"name":"Lou Rawls","slug":"lou-rawls","type":"artist"}],"asset_url":"//cdn-images.audioaddict.com/9/9/5/9/7/e/99597eec010f423afc9d648cf745c328.jpg","content":{"interactive":false,"length":239.981,"offset":null,"assets":[{"content_format_id":6,"content_quality_id":2,"size":1941571,"url":"//content.audioaddict.com/prd/d/4/1/9/b/73be3e1f18680923fe242b3d378f9d86370.mp4?purpose=playback&audio_token=c5a7dbacecf6aea002ff379da68061ae&network=jazzradio&device=chrome_69_mac_os_x_10_13_4&exp=2018-09-09T17:35:40Z&auth=1592811978bdd0f83c8be1ef3962111fe3c23701"}]},"content_accessibility":1,"details_url":"http://www.jazzradio.com/tracks/594350/vocallegends","display_artist":"Lou Rawls","display_title":"Tobacco Road","id":594350,"images":{"default":"//cdn-images.audioaddict.com/9/9/5/9/7/e/99597eec010f423afc9d648cf745c328.jpg{?size,height,width,quality,pad}"},"is_show_asset":false,"isrc":"USBN20600081","length":241,"mix":false,"parental_advisory":null,"preview":null,"preview_accessibility":0,"release":null,"release_date":null,"retail":{},"retail_accessibility":0,"title":"Tobacco Road","track":"Lou Rawls - Tobacco Road","track_container_id":null,"version":"","votes":{"up":118,"down":31,"who_upvoted":{"size":5133,"hashes":30,"seed":1536162748,"bits":[3665086132,3399009861,2883300240,1945836634,655056354,3394042852,2878058328,3104571764,3283862509,2718788566,3703141193,2143718296,62804127,3358903556,3831533116,748595743,1198665645,3203672118,4082197193,444869019,3040014434,2093006962,3168489201,2750619532,2857970810,1097362798,3080744528,2326983161,2603948552,81100949,1754492071,4039981219,3141410270,567120657,3289558748,530896863,1129575849,938099827,725038289,3816203698,4282470786,2109856971,1668439863,3565911777,2608233678,631523013,925109689,4002789026,4289232210,2090242495,3933772780,837274591,389260492,1716336921,718416231,3905316923,620058227,241854252,2831558755,1853293605,847102344,1722049611,2995101142,3236913224,3891013106,1553178371,2519691329,1634174166,3502867917,2092340105,1633738167,3929620629,176343707,2892267733,1237802919,3654296737,4047295634,2587032965,3011664000,2799667604,545962387,2789046835,3209194950,488880236,3613261990,2657302585,2889596543,3971300252,2975170909,608521015,477715189,515859169,3045021649,3300061589,3240128270,941494771,3194936136,1188757829,1912186212,1399578820,1599292167,3286202865,566503450,3301625723,2185050144,2573810017,2510362519,610748573,265968640,1030804894,4227006943,2288337141,2052595133,3779562458,2568967464,1755887444,2160954146,2749367573,1376301230,2446058256,2501967371,2074583366,3368082942,1843321112,999302932,3403131001,977142449,3351335387,2369827220,1022838301,2651897738,211131173,2419106558,3194228336,1863819186,2498124557,375637096,633319845,1150345665,4192044651,531134606,1152850551,4294964747,72758114,1681869519,3015603058,147469638,236329463,3770565055,4029122017,1316674561,951175875,2150239480,719630507,3946089732,1285117299,3748682339,527520290,214816249,1216722598,6275],"items":null},"who_downvoted":{"size":1381,"hashes":30,"seed":1536162748,"bits":[2246292814,84420993,2104533336,625078189,99856555,2644612511,2902803766,2112817901,2249761890,4193236202,230748531,3048932570,1846023269,4215857236,948936569,2782299068,339427530,2152338917,3437557049,491350169,3153171598,980019803,1338354710,1692012575,3846513933,1335487978,2876814457,2101826689,1187314215,3370149293,3069712195,688880596,2594026821,1588752031,1667579448,276856365,3704610288,911581804,1754606652,820811221,198017599,1093977795,1648112825,17],"items":null}},"waveform_url":"//waveform.audioaddict.com/prd/b/9/3/c/c/9cb1251382a241656e356ea136901f3c792.json"}]};
//#endregion

const PlaylistChannelId = 0;

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private _channelTracks: Array<Track> = [];
  private _channelList: Array<Channel> = [];

  private _currentChannel$ = new BehaviorSubject<Channel>(undefined);
  public readonly currentChannel$ = this._currentChannel$.asObservable();

  private _currentTrack$ = new BehaviorSubject<Track>(undefined);
  public readonly currentTrack$ = this._currentTrack$.asObservable();

  private _historyTrackInfo: {channelTrack: Track, historyTrack: Track};

  constructor(
    private http: HttpClient,
    private playlistService: PlaylistService
  ) { }

  getChannelList(): Observable<Array<Channel>> {
    // return ObservableOf(ChannelListMock)
    return this.http.get<any>('https://www.jazzradio.com/_papi/v1/jazzradio/currently_playing?callback=__ng_jsonp__.__req0.finished')
      .pipe(
        map((response) => {
          response.unshift({
            channel_id: PlaylistChannelId,
            channel_key: 'playlist'
          });
          return response.map((ch) => {
            return {
              id: ch.channel_id,
              name: ch.channel_key
            };
          });
        }),
        tap((channelList) => {
          this._channelList = channelList;
        })
      );
  }

  getChannel(channelId): Observable<Array<Track>> {
    if (channelId === PlaylistChannelId) {
      return ObservableOf(this.playlistService.getPlaylist())
        .pipe(tap((tracks) => {
          this._channelTracks = tracks;
        }));
    }

    return this.http.get<any>(`https://www.jazzradio.com/_papi/v1/jazzradio/routines/channel/${channelId}?audio_token=c5a7dbacecf6aea002ff379da68061ae&_=%201501752135802`)
      .pipe(
        filter((response) => response.channel_id === this.getCurrentChannelId()),
        map((response) => {
          return response.tracks.map((t) => {
            return {
              id: t.id,
              title: t.display_title,
              artist: t.display_artist,
              albumArtUrl: t.asset_url,
              musicUrl: t.content.assets[0].url
            };
          });
        }),
        tap((tracks) => {
          this._channelTracks = this._channelTracks.concat(tracks);
        })
      );
  }

  getCurrentChannel(): Channel {
    return this._currentChannel$.getValue();
  }

  getCurrentChannelId(): number {
    return this.getCurrentChannel() ? this.getCurrentChannel().id : -1;
  }

  getCurrentTrack(): Track {
    return this._currentTrack$.getValue();
  }

  changeChannel(channelId: number) {
    if (channelId === this.getCurrentChannelId()) return;

    this._currentTrack$.next(undefined);
    this._currentChannel$.next(this._channelList.find((channel) => channel.id === channelId));
    this._channelTracks = [];
  }

  requestNextTrack() {
    let currentTrackIndex = this.getIndexOfCurrentTrack();
    let nextTrackRequest: Observable<Track>;

    if (currentTrackIndex === -1 ||
        currentTrackIndex === this._channelTracks.length - 1) {

      let newTrackIndex;
      if (this.getCurrentChannelId() === PlaylistChannelId &&
          currentTrackIndex === this._channelTracks.length - 1) {
        newTrackIndex = 0;
      } else {
        newTrackIndex = currentTrackIndex + 1;
      }

      nextTrackRequest = this.getChannel(this.getCurrentChannelId())
        .pipe(map(() => {
          return this._channelTracks[newTrackIndex];
        }));
    } else {
      nextTrackRequest = ObservableOf(this._channelTracks[++currentTrackIndex]);
    }

    nextTrackRequest.subscribe((track: Track) => {
      this._currentTrack$.next(track);
    });
  }

  requestHistoryTrack(track: Track, channelId: number) {
    if (channelId === PlaylistChannelId) {
      this.requestPlaylistTrack(track);
      return;
    }

    if (!this.getCurrentChannel() ||
        this.getCurrentChannel().id !== channelId) {
      this.changeChannel(channelId);
      this._channelTracks.push(track);
    } else {
      const existingTrackIndex = this._channelTracks.findIndex((cTrack) => cTrack.id === track.id);
      if (existingTrackIndex !== -1) {
        this._channelTracks.splice(existingTrackIndex, 1);
      }

      const currentTrackIndex = this.getIndexOfCurrentTrack();
      if (currentTrackIndex === this._channelTracks.length - 1) {
        this._channelTracks.push(track);
      } else {
        this._channelTracks.splice(currentTrackIndex + 1, 0, track);
      }
    }

    this.requestNextTrack();
  }

  requestPlaylistTrack(track: Track) {
    if (!this.getCurrentChannel() ||
        this.getCurrentChannel().id !== PlaylistChannelId) {
      this.changeChannel(PlaylistChannelId);
      this.getChannel(this.getCurrentChannelId()).subscribe();
    }

    this._currentTrack$.next(track);
  }

  getIndexOfCurrentTrack(): number {
    const currentTrack = this._currentTrack$.getValue();

    if (!currentTrack) return -1;

    for (let i = this._channelTracks.length - 1; i >= 0; i--) {
      if (this._channelTracks[i].id === currentTrack.id) {
        return i;
      }
    }

    return -1;
  }

}
