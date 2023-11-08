-here for navigation we don't use 'Navigation' swiper module and create it manually ... for style Navigation we have 'navigationContainerClassName','navigationClassName'

-for pagination we always use Swiper 'Pagination' module ... for style pagination we use vanilla html way(adding css class to container and use css to style it)

-we can define events like <Swiper onSlideChange={()=>{...}} />

-some of important events:

    onBeforeInit,onAfterInit,onBeforeDestroy,onDestroy,onClick,onProgress,onSlideChange,onUpdate(after calling Swiper.update()),onReachBeginning,onReachEnd

    *swiper has events for touch,mouse,keyboard,transition(start,end,...),

-list of modules:

    https://swiperjs.com/react#styles

-for see all properties of modules see:

    https://swiperjs.com/swiper-api#modules

-Controller module if we want to sync two swiper instance to each other

-Thumbs module for thumbnail(thumbnail can be clickable too)

-EffectCoverflow module is for create 3D sliders

-we have modules for lazy/virtual slides,keyboard,mouse,scrollbar,parallax,zoom,
history/hash,other effects like cube,flip,...

-each module has its own settings,methods,events:

    check https://swiperjs.com/swiper-api#modules

    *e.g for Navigation module we can use <Swiper navigation={false} /> to disable it totally or <Swiper navigation/> to enable it with default settings or <Swiper navigation={{nextEl:'',prevEl:'',enabled}} /> to use custom settings

-we have effects like fade,flip,cube,card,creating,coverflow and just like any other modules each of them can have its own settings

-swiper has some props for observe mutation on parent,observe mutation on slides,resize
observer,navigation/history hash url,...
