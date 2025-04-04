var Bullets=Gobj.extends({
    constructorPlus:function(props){
        this.owner=props.from;
        //Makes below initial keep the same
        var ownerX=(this.owner instanceof Gobj)?(this.owner.posX()):(this.owner.x);
        var ownerY=(this.owner instanceof Gobj)?(this.owner.posY()):(this.owner.y);
        this.target=props.to;
        //Makes below initial keep the same
        var targetX=(this.target instanceof Gobj)?(this.target.posX()):(this.target.x);
        var targetY=(this.target instanceof Gobj)?(this.target.posY()):(this.target.y);
        //Convert from center point to left-top
        this.x=ownerX-this.width/2;
        this.y=ownerY-this.height/2;
        //Use centerP to centerP is correct, bullet has inconsistent speed
        this.speed={
            x:(targetX-ownerX)/(this.duration/100),
            y:(targetY-ownerY)/(this.duration/100)
        };
        if (this.forbidRotate) this.angle=0;
        else {
            //Below angle represents direction toward target
            this.angle=Math.atan((ownerY-targetY)/(targetX-ownerX));
            if (targetX<ownerX) this.angle+=Math.PI;
        }
        //By default it's not shown
        this.status="dead";
        //Fixed damage if be set
        if (props.damage!=null) this.damage=props.damage;
    },
    prototypePlus:{
        duration:500,//Will move for 500ms as default
        //Override to use 8 directions speed
        updateLocation:function(){
            //No direction speed
            this.x+=this.speed.x;
            this.y+=this.speed.y;
        },
        burst:function(){
            var owner=this.owner;
            var target=this.target;
            //Bullet over, now burst turn to show
            this.die();
            //Filter out magic bullet with fixed destination
            if (!(target instanceof Gobj)) return;
            //Init targets if AOE
            var targets;
            if (owner.AOE) {
                //Get possible targets
                if (owner.isEnemy) {
                    targets=(owner.attackLimit)?((owner.attackLimit=="flying")?
                        Unit.ourFlyingUnits:Unit.ourGroundUnits.concat(Building.ourBuildings))
                        :(Unit.allOurUnits().concat(Building.ourBuildings));
                }
                else {
                    targets=(owner.attackLimit)?((owner.attackLimit=="flying")?
                        Unit.enemyFlyingUnits:Unit.enemyGroundUnits.concat(Building.enemyBuildings))
                        :(Unit.allEnemyUnits().concat(Building.enemyBuildings));
                }
                //Range filter
                switch (owner.AOE.type) {
                    case "LINE":
                        //Calculate inter-points between enemy
                        var N=Math.ceil(owner.distanceFrom(target)/(owner.AOE.radius));
                        targets=targets.filter(function(chara){
                            for (var n=1;n<=N;n++){
                                var X=owner.posX()+n*(target.posX()-owner.posX())/N;
                                var Y=owner.posY()+n*(target.posY()-owner.posY())/N;
                                if (chara.insideCircle({centerX:X>>0,centerY:Y>>0,radius:owner.AOE.radius}) && !chara.isInvisible) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        break;
                    //Default type is CIRCLE
                    case "CIRCLE":
                    default:
                        targets=targets.filter(function(chara){
                            return chara.insideCircle(
                                {centerX:target.posX(),centerY:target.posY(),radius:owner.AOE.radius})
                                && !chara.isInvisible;
                        });
                }
            }
            if (this.burstEffect) {
                //Show burst effect on target
                if (owner.AOE && owner.AOE.hasEffect) {
                    var burstEffect=this.burstEffect;
                    targets.forEach(function(chara){
                        new burstEffect({target:chara,above:true});
                    })
                }
                else {
                    new this.burstEffect({target:target,above:true});
                }
            }
            //Real bullet
            if (!this.noDamage) {
                //Cause damage when burst appear
                if (owner.AOE) {
                    var myself=this;
                    targets.forEach(function(chara){
                        if (myself.damage!=null) target.getDamageBy(myself.damage);
                        else target.getDamageBy(owner);
                        chara.reactionWhenAttackedBy(owner);
                    })
                }
                else {
                    if (this.damage!=null) target.getDamageBy(this.damage);
                    else target.getDamageBy(owner);
                    target.reactionWhenAttackedBy(owner);
                }
            }
        },
        //Upgrade Gobj moving, replace run as fire
        fire:function(callback){
            this.moving();
            //Sound effect
            if (this.insideScreen() && this.owner.sound && this.owner.sound.attack) this.owner.sound.attack.play();
            //Will burst and stop moving after time limit arrive
            var myself=this;
            setTimeout(function(){
                myself.burst();
                //Something happens after bullet burst
                if (callback) callback();
            },this.duration);
        }
    }
});
Bullets.Spooge=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Hydralisk",
        duration:400,
        imgPos:{
            moving:{
                left:[14, 72, 136, 204],
                top:[758,758,758,758]
            }
        },
        width:56,
        height:28,
        frame:{
            moving:4
        },
        burstEffect:Burst.HydraSpark
    }
});
Bullets.Thorn=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Lurker",
        duration:600,
        imgPos:{
            moving:{
                left:[61,88,117,144,117,88],
                top:[711,711,711,711,711,711]
            }
        },
        width:28,
        height:35,
        frame:{
            moving:6
        },
        forbidRotate:true
    }
});
Bullets.Darts=Bullets.extends({
    constructorPlus:function(props){
        this.life=this.traceTimes;
    },
    prototypePlus:{
        //Add basic unit info
        name:"Burst",//Source img inside Mutalisk.png
        duration:400,//Match attack sound=1000?
        imgPos:{
            moving:{
                left:[0, 36, 72, 108, 144, 180, 216, 252, 288, 324],
                top:[1051,1051,1051,1051,1051,1051,1051,1051,1051,1051]
            }
        },
        width:36,
        height:36,
        frame:{
            moving:10
        },
        burstEffect:Burst.GreenFog,
        //Chain tracing attack
        traceTimes:3,
        traceRadius:100,
        //Override
        noDamage:true,
        die:function(){
            var target=this.target;
            var owner=this.owner;
            //Interrupt tracing if target is dead first
            if (target.status=="dead") {
                //Former behavior before override
                this.inherited.die.call(this);
            }
            //Override damage, damage reduce
            target.getDamageBy(owner,this.life/this.traceTimes);
            target.reactionWhenAttackedBy(owner);
            //Bullet reduce
            this.life--;
            var myself=this;
            var traceEnemies;
            //Get all possible enemies
            if (owner.isEnemy) {
                traceEnemies=(owner.attackLimit)?((owner.attackLimit=="flying")?
                    Unit.ourFlyingUnits:Unit.ourGroundUnits):Unit.allOurUnits();
            }
            else {
                traceEnemies=(owner.attackLimit)?((owner.attackLimit=="flying")?
                    Unit.enemyFlyingUnits:Unit.enemyGroundUnits):Unit.allEnemyUnits();
            }
            //Filter out trace-able enemies
            traceEnemies=traceEnemies.filter(function(chara) {
                return (chara!=myself.target) &&
                    chara.insideCircle({centerX:myself.posX(),centerY:myself.posY(),radius:myself.traceRadius});
            });
            //Attack trace enemy
            if (traceEnemies.length>0 && this.life>0){
                //Initial position again before jumping
                this.x=target.posX()-this.width/2;
                this.y=target.posY()-this.height/2;
                this.target=traceEnemies[0];
                var targetX=this.target.posX();
                var targetY=this.target.posY();
                var myX=this.posX();
                var myY=this.posY();
                //Update bullet speed
                this.speed={
                    x:(targetX-myX)/(this.duration/100),
                    y:(targetY-myY)/(this.duration/100)
                };
                //Update bullet angle
                if (this.forbidRotate) this.angle=0;
                else {
                    //Below angle represents direction toward target
                    this.angle=Math.atan((myY-targetY)/(targetX-myX));
                    if (targetX<myX) this.angle+=Math.PI;
                }
                //Fire bullet
                setTimeout(function(){
                    myself.burst();
                },this.duration);
            }
            else {
                //Former behavior before override
                this.inherited.die.call(this);
            }
        }
    }
});
Bullets.Parasite=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:600,
        imgPos:{
            moving:{
                left:152,
                top:0
            }
        },
        width:10,
        height:34,
        frame:{
            moving:1
        },
        burstEffect:Burst.Parasite
    }
});
Bullets.GreenBall=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Guardian",
        duration:800,//Match attack sound
        imgPos:{
            moving:{
                left:32,
                top:520
            }
        },
        width:20,
        height:20,
        frame:{
            moving:1
        },
        forbidRotate:true,
        burstEffect:Burst.GreenBallBroken
    }
});
Bullets.PurpleCloud=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Devourer",
        duration:900,//Match attack sound
        imgPos:{
            moving:{
                left:8,
                top:973
            }
        },
        width:70,
        height:32,
        frame:{
            moving:1
        },
        burstEffect:Burst.PurpleCloudSpread
    }
});
Bullets.Spore=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:800,
        imgPos:{
            moving:{
                left:522,
                top:6
            }
        },
        width:20,
        height:20,
        frame:{
            moving:1
        },
        burstEffect:Burst.Spore
    }
});
Bullets.Flame=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:300,
        imgPos:{
            moving:{
                left:[15,15,80,80,170,170],
                top:[86,86,86,86,86,86]
            }
        },
        width:76,
        height:40,
        frame:{
            moving:6
        }
    }
});
Bullets.VultureBall=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:600,
        imgPos:{
            moving:{
                left:152,
                top:0
            }
        },
        width:10,
        height:34,
        frame:{
            moving:1
        },
        burstEffect:Burst.VultureSpark
    }
});
Bullets.Missile=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Wraith",
        duration:1000,//Match attack sound
        imgPos:{
            moving:{
                left:8,
                top:90
            }
        },
        width:16,
        height:32,
        frame:{
            moving:1
        },
        burstEffect:Burst.FireSparkSound
    }
});
Bullets.LongMissile=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:600,//Match unit
        imgPos:{
            moving:{
                left:0,
                top:0
            }
        },
        width:35,
        height:30,
        frame:{
            moving:1
        },
        burstEffect:Burst.FireSparkSound
    }
});
Bullets.SingleMissile=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:600,//Match unit
        imgPos:{
            moving:{
                left:0,
                top:0
            }
        },
        width:35,
        height:15,
        frame:{
            moving:1
        },
        burstEffect:Burst.FireSparkSound
    }
});
/*Bullets.MultipleMissileOld=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:600,//Match unit
        imgPos:{
            moving:{
                left:430,//230,430,454
                top:0
            }
        },
        width:74,//48,74
        height:32,
        frame:{
            moving:1
        },
        burstEffect:Burst.SmallFireSpark
    }
});*/
Bullets.MultipleMissile=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:600,//Match unit
        imgPos:{
            moving:{
                left:304,
                top:56
            }
        },
        width:94,
        height:50,
        frame:{
            moving:1
        },
        burstEffect:Burst.FireSparkSound
    }
});
Bullets.Laser=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"BattleCruiser",
        duration:300,//Match attack sound
        imgPos:{
            moving:{
                left:16,
                top:170
            }
        },
        width:68,
        height:12,
        frame:{
            moving:1
        },
        burstEffect:Burst.LaserSpark
    }
});
Bullets.SmallLaser=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"BattleCruiser",
        duration:300,//Match attack sound
        imgPos:{
            moving:{
                left:20,
                top:170
            }
        },
        width:22,
        height:12,
        frame:{
            moving:1
        },
        burstEffect:Burst.LaserSpark
    }
});
Bullets.HeatLaser=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"HeroCruiser",
        duration:300,//Match attack sound
        imgPos:{
            moving:{
                left:16,
                top:170
            }
        },
        width:68,
        height:12,
        frame:{
            moving:1
        },
        burstEffect:Burst.SmallExplode
    }
});
Bullets.Yamato=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:500,//Match attack sound
        imgPos:{
            moving:{
                left:[288, 192, 96, 0],
                top:[1195,1195,1195,1195]
            }
        },
        width:96,
        height:96,
        frame:{
            moving:4
        },
        burstEffect:Burst.MiddleExplode
    }
});
Bullets.NuclearBomb=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:1000,
        imgPos:{
            moving:{
                left:428,
                top:66
            }
        },
        width:74,
        height:32,
        frame:{
            moving:1
        }
    }
});
Bullets.DragoonBall=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:800,//Match attack sound
        imgPos:{
            moving:{
                left:[5, 36, 70, 101, 133],
                top:[862,862,862,862,862]
            }
        },
        width:23,
        height:21,
        frame:{
            moving:5
        },
        forbidRotate:true,
        burstEffect:Burst.DragoonBallBroken,
        //Delay fire for Dragoon and PhotonCannon
        fire:function(){
            var delay=this.owner.fireDelay;
            if (!delay) delay=0;
            //Inherit fire function
            var myself=this;
            setTimeout(function(){
                Bullets.prototype.fire.call(myself);
            },delay);
        }
    }
});
Bullets.ArchonLightening=Bullets.extends({
    constructorPlus:function(props){
        //Override position to hands
        this.x+=this.speed.x*6;//N/8==40/70 (ArchonRadius/AttackRange)
        this.y+=this.speed.y*6;
        //Override speed, will not move
        this.speed={x:0,y:0};
    },
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:800,
        imgPos:{
            moving:{
                left:[4, 192, 388, 580],
                top:[704,704,704,704]
            }
        },
        width:90,
        height:75,
        frame:{
            moving:4
        }
    }
});
Bullets.ScoutMissile=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:1000,
        imgPos:{
            moving:{
                left:53,//53//580
                top:0
            }
        },
        width:30,//30//55
        height:34,//34//45
        frame:{
            moving:1
        },
        burstEffect:Burst.DragoonBallBroken
    }
});
Bullets.ReaverBomb=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:1000,
        imgPos:{
            moving:{
                left:350,//186
                top:0
            }
        },
        width:70,//62
        height:34,
        frame:{
            moving:1
        },
        burstEffect:Burst.ReaverBurst,
        //Override
        fire:function(){
            Bullets.prototype.fire.call(this);
            //Consume scarab
            if (this.owner.scarabNum>0) {
                this.owner.scarabNum--;
                Button.reset();
            }
        }
    }
});
Bullets.ReaverBombII=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:1000,
        imgPos:{
            moving:{
                left:300,
                top:0
            }
        },
        width:40,
        height:30,
        frame:{
            moving:1
        },
        forbidRotate:true,
        burstEffect:Burst.ReaverBurst
    }
});
Bullets.Interceptor=Bullets.extends({
    constructorPlus:function(props){},
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        duration:1000,
        imgPos:{
            moving:{
                left:[120,170,220,272,272,120,120,120,120,120],
                top:[582,582,582,582,582,582,582,582,582,582]
            }
        },
        width:44,
        height:28,
        frame:{
            moving:10
        },
        //Override cause damage timing
        noDamage:true,
        fire:function(){
            this.inherited.fire.call(this);
            var target=this.target;
            var owner=this.owner;
            setTimeout(function(){
                target.getDamageBy(owner);
                target.reactionWhenAttackedBy(owner);
            },500);
        }
    }
});
Bullets.DevilBall=Bullets.extends({
    constructorPlus:function(props){
        this.life=this.traceTimes;
    },
    prototypePlus:{
        //Add basic unit info
        name:"Mutalisk",
        duration:300,
        imgPos:{
            moving:{
                left:352,
                top:442
            }
        },
        width:20,
        height:20,
        frame:{
            moving:1
        },
        burstEffect:Burst.PurpleFog,
        //Delay fire for Dragoon and PhotonCannon
        fire:Bullets.DragoonBall.prototype.fire,
        //Chain tracing attack
        traceTimes:4,
        traceRadius:200,
        //Override
        noDamage:true,
        //Chain attack type
        die:Bullets.Darts.prototype.die
    }
});
//Mapping for apply, need to move it into Units.js
Zerg.Drone.prototype.Bullet=Bullets.Spooge;
Zerg.Hydralisk.prototype.Bullet=Bullets.Spooge;
Zerg.Lurker.prototype.Bullet=Bullets.Thorn;
Zerg.Mutalisk.prototype.Bullet=Bullets.Darts;
Zerg.Guardian.prototype.Bullet=Bullets.GreenBall;
Zerg.Devourer.prototype.Bullet=Bullets.PurpleCloud;

Terran.Wraith.prototype.attackMode.flying.Bullet=Bullets.Missile;
Terran.Wraith.prototype.attackMode.ground.Bullet=Bullets.SmallLaser;
Terran.BattleCruiser.prototype.Bullet=Bullets.Laser;
Terran.Firebat.prototype.Bullet=Bullets.Flame;
Terran.Vulture.prototype.Bullet=Bullets.VultureBall;
Terran.Goliath.prototype.attackMode.flying.Bullet=Bullets.LongMissile;
Terran.Valkyrie.prototype.Bullet=Bullets.MultipleMissile;

Protoss.Dragoon.prototype.Bullet=Bullets.DragoonBall;
Protoss.Archon.prototype.Bullet=Bullets.ArchonLightening;
Protoss.Reaver.prototype.Bullet=Bullets.ReaverBomb;
Protoss.Scout.prototype.attackMode.flying.Bullet=Bullets.ScoutMissile;
Protoss.Arbiter.prototype.Bullet=Bullets.DragoonBall;
Protoss.Carrier.prototype.Bullet=Bullets.Interceptor;

Hero.HeroCruiser.prototype.Bullet=Bullets.Yamato;
Hero.DevilHunter.prototype.Bullet=Bullets.DevilBall;

Building.ZergBuilding.SporeColony.prototype.Bullet=Bullets.Spore;
Building.TerranBuilding.MissileTurret.prototype.Bullet=Bullets.SingleMissile;
Building.ProtossBuilding.PhotonCannon.prototype.Bullet=Bullets.DragoonBall;
