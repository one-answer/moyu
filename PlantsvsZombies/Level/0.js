oS.Init({
	PicArr: function() {
		var a = $User.Browser.IE6 ? 8 : 32;
		return [ShadowPNG, "https://haiyong.site/moyu/pvz/images/Sun.gif", "https://haiyong.site/moyu/pvz/images/OptionsMenuback" + a + ".png", "https://haiyong.site/moyu/pvz/images/OptionsBackButton" + a +
			".png", "https://haiyong.site/moyu/pvz/images/Surface.png", "https://haiyong.site/moyu/pvz/images/Help.png", "https://haiyong.site/moyu/pvz/images/SelectorScreenStartAdventur.png",
			"https://haiyong.site/moyu/pvz/images/SelectorScreenSurvival.png", "https://haiyong.site/moyu/pvz/images/Logo.jpg", "https://haiyong.site/moyu/pvz/images/LawnMower.gif", "https://haiyong.site/moyu/pvz/images/ZombiesWon.png",
			"https://haiyong.site/moyu/pvz/images/LargeWave.gif", "https://haiyong.site/moyu/pvz/images/FinalWave.gif", "https://haiyong.site/moyu/pvz/images/PrepareGrowPlants.gif", "https://haiyong.site/moyu/pvz/images/interface/PointerUP.gif",
			"https://haiyong.site/moyu/pvz/images/interface/PointerDown.gif", "https://haiyong.site/moyu/pvz/images/interface/Shovel.png", "https://haiyong.site/moyu/pvz/images/interface/SunBack.png",
			"https://haiyong.site/moyu/pvz/images/interface/ShovelBack.png", "https://haiyong.site/moyu/pvz/images/interface/GrowSoil.png",
			"https://haiyong.site/moyu/pvz/images/interface/SeedChooser_Background.png", "https://haiyong.site/moyu/pvz/images/interface/Button.png", "https://haiyong.site/moyu/pvz/images/interface/LogoLine.png",
			"https://haiyong.site/moyu/pvz/images/interface/dialog_topleft.png", "https://haiyong.site/moyu/pvz/images/interface/dialog_topmiddle.png",
			"https://haiyong.site/moyu/pvz/images/interface/dialog_topright.png", "https://haiyong.site/moyu/pvz/images/interface/dialog_centerleft.png",
			"https://haiyong.site/moyu/pvz/images/interface/dialog_centermiddle.png", "https://haiyong.site/moyu/pvz/images/interface/dialog_centerright.png",
			"https://haiyong.site/moyu/pvz/images/interface/SelectorScreen_Almanac.png", "https://haiyong.site/moyu/pvz/images/interface/SelectorScreen_AlmanacHighlight.png",
			"https://haiyong.site/moyu/pvz/images/interface/dialog_bottomleft.png", "https://haiyong.site/moyu/pvz/images/interface/dialog_bottommiddle.png",
			"https://haiyong.site/moyu/pvz/images/interface/dialog_bottomright.png", "https://haiyong.site/moyu/pvz/images/interface/Almanac_IndexBack.jpg",
			"https://haiyong.site/moyu/pvz/images/interface/Almanac_IndexButton.png", "https://haiyong.site/moyu/pvz/images/interface/Almanac_CloseButton.png",
			"https://haiyong.site/moyu/pvz/images/interface/Almanac_CloseButtonHighlight.png", "https://haiyong.site/moyu/pvz/images/interface/Almanac_IndexButtonHighlight.png",
			"https://haiyong.site/moyu/pvz/images/interface/Almanac_PlantBack.jpg", "https://haiyong.site/moyu/pvz/images/interface/Almanac_PlantCard.png",
			"https://haiyong.site/moyu/pvz/images/interface/Almanac_ZombieBack.jpg", "https://haiyong.site/moyu/pvz/images/interface/Almanac_ZombieCard.png",
			"https://haiyong.site/moyu/pvz/images/interface/AwardScreen_Back.jpg"
		]
	}(),
	LevelName: "JSPVZ",
	LoadMusic: function() {
		NewEle("oEmbed", "embed", "width:0;height:0", {
			src: "music/Faster.swf"
		}, EDAll)
	},
	LoadAccess: function() {
		EDAll.scrollLeft = 0;
		EDAll.innerHTML += WordUTF8;
		LoadProProcess();
		oSym.Stop()
	}
});
