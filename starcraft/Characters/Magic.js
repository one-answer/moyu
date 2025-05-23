var Magic={
    //Zerg
    Burrow:{
        name:"Burrow",
        enabled:false,
        spell:function(){
            this.dock();
            if (this.stopAttack) this.stopAttack();
            this.status="burrow";
            this.action=2;
            //Effect:Freeze target
            var bufferObj={
                moveTo:function(){},
                moveToward:function(){},
                dock:function(){}
            };
            if (this.attack) bufferObj.attack=function(){};
            //Lurker has same behavior as attackable building
            if (this.name=="Lurker") {
                var mixin=$.extend({},Building.Attackable.prototypePlus);
                delete mixin.name;
                delete mixin.die;
                $.extend(bufferObj,mixin);
            }
            //Freeze immediately
            this.addBuffer(bufferObj,(this.name=="Lurker"));//onAll for Lurker
            this.burrowBuffer=[bufferObj];
            //Sound effect
            if (this.insideScreen()) this.sound.burrow.play();
            //Forbid actions
            var itemsBackup=this.items;
            this.items={'1':undefined,'2':undefined,'3':undefined,'4':undefined,'5':undefined,
                '6':undefined,'7':undefined,'8':undefined,'9':undefined};
            Button.reset();
            //Finish burrow
            var myself=this;
            setTimeout(function(){
                //Invisible when finish burrow
                var bufferObjII={isInvisible:true};
                myself.addBuffer(bufferObjII);
                myself.burrowBuffer.push(bufferObjII);
                myself.buffer.Burrow=true;
                //Change icon when finish burrow
                var items=_$.clone(itemsBackup);
                for (var N in items){
                    if (items[N] && items[N].name=="Burrow") items[N].name="Unburrow";
                }
                myself.items=items;
                //Apply callback
                Button.reset();
            },this.imgPos.burrow.left[0].length*100-200);
        }
    },
    Unburrow:{
        name:"Unburrow",
        enabled:false,
        spell:function(){
            this.status="unburrow";
            this.action=0;
            //Show unit immediately
            this.removeBuffer(this.burrowBuffer.pop());
            //Sound effect
            if (this.insideScreen()) this.sound.unburrow.play();
            //Forbid actions
            this.items={'1':undefined,'2':undefined,'3':undefined,'4':undefined,'5':undefined,
                '6':undefined,'7':undefined,'8':undefined,'9':undefined};
            Button.reset();
            //Finish unburrow
            var myself=this;
            delete myself.buffer.Burrow;//Restore shadow immediately
            setTimeout(function(){
                if (myself.burrowBuffer) {
                    //Release freeze
                    if (myself.removeBuffer(myself.burrowBuffer.pop())) {
                        delete myself.burrowBuffer;
                    }
                }
                //Recover icons and apply callbacks
                delete myself.items;
                Button.reset();
                myself.dock();
                myself.direction=(myself.name=="Hydralisk" || myself.name=="Lurker")?2:3;
            },this.frame.unburrow*100-200);//margin
        }
    },
    Load:{
        name:"Load",
        enabled:false,
        spell:function(location){}
    },
    UnloadAll:{
        name:"UnloadAll",
        enabled:false,
        spell:function(location){}
    },
    Lurker:{
        name:"Lurker",
        enabled:false,
        cost:{
            mine:50,
            gas:100,
            man:2,
            time:400
        },
        spell:function(){}
    },
    InfestTerranCommandCenter:{
        name:"InfestTerranCommandCenter",
        enabled:true,
        spell:function(location){}
    },
    Parasite:{
        name:"Parasite",
        cost:{magic:75},
        credit:true,
        enabled:true,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Target enemy unit
                var target=Game.getSelectedOne(location.x,location.y,true,true);
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to fire parasite
                    this.moveToward(target,this.get('sight'),function(){
                        if (Resource.payCreditBill.call(myself)){
                            //Fire parasite
                            var bullet=new Bullets.Parasite({
                                from:myself,
                                to:target,
                                damage:0
                            });
                            myself.bullet=bullet;
                            bullet.fire(function(){
                                //Effect:should steal target sight
                                target.buffer.Parasite=true;
                            });
                        }
                    });
                }
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    SpawnBroodlings:{
        name:"SpawnBroodlings",
        cost:{magic:150},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Kill enemy unit ground
                var target=Game.getSelectedOne(location.x,location.y,true,true,false);
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to fire SpawnBroodlings
                    this.moveToward(target,this.get('sight'),function(){
                        if (Resource.payCreditBill.call(myself)){
                            //Fire SpawnBroodlings to kill that enemy immediately
                            var bullet=new Bullets.Parasite({
                                from:myself,
                                to:target,
                                damage:99999
                            });
                            myself.bullet=bullet;
                            //Effect
                            bullet.fire(function(){
                                for (var n=0;n<2;n++){
                                    new Zerg.Broodling({x:target.posX(),y:target.posY()});
                                }
                            });
                        }
                    });
                }
                //Empty object {}, cannot spell
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    Ensnare:{
        name:"Ensnare",
        cost:{magic:75},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire Ensnare
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,this.get('sight'),function(){
                    if (Resource.payCreditBill.call(myself)){
                        //Fire Ensnare
                        var bullet=new Bullets.Parasite({
                            from:myself,
                            to:{x:location.x,y:location.y}
                        });
                        myself.bullet=bullet;
                        //Fire Ensnare bullet with callback
                        bullet.fire(function(){
                            //Ensnare animation and sound
                            var anime=new Animation.Ensnare({x:location.x,y:location.y});
                            if (anime.insideScreen()) new Audio('bgm/Magic.Ensnare.wav').play();
                            //Get in range enemy units
                            var targets=Game.getInRangeOnes(location.x,location.y,[76*1.2>>0,62*1.2>>0],true,true);
                            //Slow moving speed
                            var bufferObj={
                                speed:Unit.getSpeedMatrixBy(2)
                            };
                            //Effect
                            targets.forEach(function(chara){
                                //Buffer flag
                                if (chara.buffer.Ensnare) return;//Not again
                                chara.buffer.Ensnare=true;
                                chara.addBuffer(bufferObj);
                                //Green effect
                                new Animation.GreenEffect({target:chara,callback:function(){
                                    if (chara.status!='dead' && chara.buffer.Ensnare){
                                        //Restore
                                        if (chara.removeBuffer(bufferObj)) delete chara.buffer.Ensnare;
                                    }
                                }});
                            });
                        });
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    Consume:{
        name:"Consume",
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Kill our unit ground
                var target=Game.getSelectedOne(location.x,location.y,false,true,false);
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to consume
                    this.moveToward(target,70,function(){
                        //Effect
                        var anime=new Animation.Consume({target:target,callback:function(){
                            //Consume sound
                            if (anime.insideScreen()) new Audio('bgm/Magic.Consume.wav').play();
                            //Consume animation missing
                            target.die();
                            myself.magic+=50;
                            if (myself.magic>myself.get('MP')) myself.magic=myself.get('MP');
                        }});
                    });
                }
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    DarkSwarm:{
        name:"DarkSwarm",
        cost:{magic:100},
        credit:true,
        _timer:0,
        enabled:true,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire DarkSwarm
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,this.get('sight'),function(){
                    if (Resource.payCreditBill.call(myself)){
                        //DarkSwarm animation, play hidden frames at first
                        new Animation.DarkSwarm({x:location.x,y:location.y}).action=6;
                        //Dynamic update targets every 1 second
                        var targets=[];
                        //Full guard from distance
                        var bufferObj={
                            //Full guard from distance
                            calculateDamageBy:function(enemyObj,percent){
                                if (enemyObj.meleeAttack){
                                    var enemyAttackType=enemyObj.attackType;
                                    if (!enemyAttackType && enemyObj.attackMode){
                                        enemyAttackType=(this.isFlying)?enemyObj.attackMode.flying.attackType:enemyObj.attackMode.ground.attackType;
                                    }
                                    return enemyObj.get('damage')*Unit.attackMatrix[enemyAttackType][this.unitType];
                                }
                                //Full guard
                                else return 0;
                            }
                        };
                        //Dark swarm wave
                        var darkSwarm=function(){
                            //Clear old units buffer
                            targets.forEach(function(chara){
                                chara.removeBuffer(bufferObj);
                            });
                            targets=[];
                            var darkSwarms=Burst.allEffects.filter(function(effect){
                                return effect instanceof Animation.DarkSwarm;
                            });
                            //Check if any swarm effect exist
                            if (darkSwarms.length) {
                                //Get targets inside all of swarms
                                darkSwarms.forEach(function(swarm){
                                    //Update buffer on our ground units inside swarm
                                    targets=targets.concat(Game.getInRangeOnes(swarm.posX(),swarm.posY(),[126*1.2>>0,94*1.2>>0],false,true,false));
                                });
                                $.unique(targets);
                                //Effect
                                targets.forEach(function(chara){
                                    //Guard from range-attack enemy
                                    chara.addBuffer(bufferObj);
                                });
                                Magic.DarkSwarm._timer=setTimeout(darkSwarm,1000);
                            }
                            else Magic.DarkSwarm._timer=0;
                        };
                        //If not calculating, execute
                        if (!Magic.DarkSwarm._timer) darkSwarm();
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    Plague:{
        name:"Plague",
        cost:{magic:150},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire Plague
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,this.get('sight'),function(){
                    if (Resource.payCreditBill.call(myself)){
                        //Plague animation and sound
                        var anime=new Animation.Plague({x:location.x,y:location.y});
                        if (anime.insideScreen()) new Audio('bgm/Magic.Ensnare.wav').play();
                        //Get in range enemy units
                        var targets=Game.getInRangeOnes(location.x,location.y,[64*1.2>>0,64*1.2>>0],true,true);
                        //Effect:HP losing every seconds
                        var bufferObj={
                            recover:function(){
                                if (this.life>0) this.life-=25;//Refresh every 1 seconds
                                if (this.life<=0) this.life=1;
                            }
                        };
                        targets.forEach(function(chara){
                            //Buffer flag
                            if (chara.buffer.Plague) return;//Not again
                            chara.buffer.Plague=true;
                            //HP losing every seconds
                            chara.addBuffer(bufferObj);
                            //Green effect
                            new Animation.RedEffect({target:chara,callback:function(){
                                if (chara.status!='dead' && chara.buffer.Plague){
                                    //Restore
                                    if (chara.removeBuffer(bufferObj)) delete chara.buffer.Plague;
                                }
                            }});
                        });
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    //Terran
    StimPacks:{
        name:"StimPacks",
        enabled:false,
        spell:function(){
            //Rage flag for units to decide stim or not
            if (!this.buffer.Stim) {
                //Cause damage
                this.life-=10;
                if (this.life<1) this.life=1;
                //Stim sound
                if (this.insideScreen()) new Audio('bgm/Magic.StimPacks.wav').play();
                //Effect
                var bufferObj={
                    attackInterval:800,
                    speed:Unit.getSpeedMatrixBy(14)
                };
                this.addBuffer(bufferObj);
                this.buffer.Stim=true;
                //Will only be stim for 15sec
                var myself=this;
                setTimeout(function(){
                    if (myself.status!='dead' && myself.buffer.Stim){
                        //Special effect is over
                        if (myself.removeBuffer(bufferObj)) delete myself.buffer.Stim;
                    }
                },15000);
            }
        }
    },
    PersonalCloak:{
        name:"PersonalCloak",
        cost:{magic:25},
        enabled:false,
        spell:function(){
            //Will only be invisible when having magic
            if (!this.cloakBuffer) {
                var bufferObj={
                    isInvisible:true,
                    //Magic losing every seconds
                    recover:function(){
                        //Should not forbid old recover
                        this.constructor.prototype.recover.call(this);
                        //Losing magic
                        if (this.magic>0 && !Cheat.gathering) this.magic--;
                        if (this.magic<=0) {
                            //Might be negative float
                            this.magic=0;
                            //Special effect is over
                            if (this.removeBuffer(bufferObj)) {
                                delete this.buffer.Cloak;
                                delete this.cloakBuffer;
                                //Recover icons and apply callbacks
                                delete this.items;
                                Button.reset();
                            }
                        }
                    }
                };
                //Effect
                this.buffer.Cloak=true;
                this.addBuffer(bufferObj);
                this.cloakBuffer=bufferObj;
            }
            //Change icon
            var items=_$.clone(this.items);
            for (var N in items){
                if (items[N].name=="Cloak") items[N].name="Decloak";
            }
            this.items=items;
            //Apply callback
            Button.reset();
        }
    },
    Decloak:{
        name:"Decloak",
        enabled:true,
        spell:function(){
            if (this.cloakBuffer) {
                //Special effect is over
                if (this.removeBuffer(this.cloakBuffer)) {
                    delete this.buffer.Cloak;
                    delete this.cloakBuffer;
                }
            }
            //Recover icons and apply callbacks
            delete this.items;
            Button.reset();
        }
    },
    Lockdown:{
        name:"Lockdown",
        cost:{magic:100},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Target enemy unit, machine unit
                var target=Game.getSelectedOne(location.x,location.y,true,true,null,function(chara){
                    return chara.isMachine() && !chara.buffer.Lockdown;
                });
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to fire lockdown
                    this.moveToward(target,300,function(){
                        if (Resource.payCreditBill.call(myself)){
                            //Fire lockdown missile
                            var bullet=new Bullets.SingleMissile({
                                from:myself,
                                to:target,
                                damage:0
                            });
                            myself.bullet=bullet;
                            bullet.fire(function(){
                                //Lockdown effect
                                if (target.status!='dead'){
                                    //Stop target
                                    if (target.stopAttack) target.stopAttack();
                                    target.dock();
                                    var bufferObj={
                                        moveTo:function(){},
                                        moveToward:function(){},
                                        attack:function(){}
                                    };
                                    //Freeze status
                                    target.addBuffer(bufferObj);
                                    target.stop();
                                    clearInterval(target.dockTimer);
                                    //Flag
                                    target.buffer.Lockdown=true;
                                    //Lockdown animation, show hidden frames first
                                    var anime=new Animation.Lockdown({target:target,callback:function(){
                                        //Restore after 60 seconds
                                        if (target.status!='dead' && target.buffer.Lockdown){
                                            if (target.removeBuffer(bufferObj)) delete target.buffer.Lockdown;
                                            target.dock();
                                        }
                                    }});
                                    anime.action=7;
                                    //Lockdown sound
                                    if (anime.insideScreen()) new Audio('bgm/Magic.Lockdown.wav').play();
                                }
                            });
                        }
                    });
                }
                //Empty object {}, cannot spell
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    NuclearStrike:{
        name:"NuclearStrike",
        enabled:1,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire Nuclear bomb
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,this.get('sight'),function(){
                    //Fire Nuclear bomb
                    var bullet=new Bullets.NuclearBomb({
                        from:{x:location.x,y:location.y-250},
                        to:{x:location.x,y:location.y}
                    });
                    myself.bullet=bullet;
                    //Fire Nuclear bomb with callback
                    bullet.fire(function(){
                        //Nuclear bomb effect, should earlier than bomb animation draw
                        //Get in range charas, no matter ours or enemies
                        var targets=Game.getInRangeOnes(location.x,location.y,175);
                        targets.forEach(function(chara){
                            //Cause 500 damage
                            chara.life-=500;
                            if (chara.life<=0) chara.die();
                        });
                        //Nuclear animation
                        var anime=new Animation.NuclearStrike({x:location.x,y:location.y});
                        //Nuclear sound
                        if (anime.insideScreen()) new Audio('bgm/Magic.NuclearStrike.wav').play();
                        //Use one bomb
                        if (Magic.NuclearStrike.enabled>0) {
                            Magic.NuclearStrike.enabled--;
                            Button.reset();
                        }
                    });
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    Heal:{
        name:"Heal",
        cost:{magic:1},
        credit:true,
        enabled:true,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                var myself=this;
                //Heal our units on ground, animal unit
                var target=Game.getSelectedOne(location.x,location.y,false,true,false,function(chara){
                    return !(chara.isMachine());
                });
                if (target instanceof Gobj){
                    this.targetLock=true;
                    //Move toward target to heal him
                    this.moveToward(target,70,function(){
                        //Heal target until becoming healthy
                        var healTimer=setInterval(function(){
                            //Medic has magic and target is injured
                            if (myself.magic && target.life<target.get('HP')) {
                                //Heal target
                                target.life+=10;
                                if (target.life>target.get('HP')) target.life=target.get('HP');
                                myself.magic-=5;
                                //Heal action and sound
                                if (myself.insideScreen()) new Audio('bgm/Magic.Heal.wav').play();
                            }
                            else clearInterval(healTimer);
                        },500);
                    });
                }
                delete Resource.creditBill;//else
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    Restoration:{
        name:"Restoration",
        cost:{magic:50},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Restore all units
                var target=Game.getSelectedOne(location.x,location.y,null,true);
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to restore unit
                    this.moveToward(target,140,function(){
                        if (Resource.payCreditBill.call(myself)){
                            //Restore effect
                            var anime=new Animation.Restoration({target:target});
                            //Restore sound
                            if (anime.insideScreen()) new Audio('bgm/Magic.Restoration.wav').play();
                            //Remove all bufferObjs
                            $.extend([],target.bufferObjs).forEach(function(bufferObj){
                                target.removeBuffer(bufferObj);
                            });
                            //Remove remaining buffer
                            if (target.cloakBuffer) delete target.cloakBuffer;
                            if (target.purpleBuffer) delete target.purpleBuffer;
                            //Delete all buffer animations on target
                            var bufferAnimations=['StasisField','Lockdown','Plague','Ensnare','PurpleEffect','RedEffect','GreenEffect','DefensiveMatrix','MaelStorm','Irradiate'];
                            $.extend([],Burst.allEffects).forEach(function(effect){
                                if (effect.target==target && bufferAnimations.some(function(name){return (effect instanceof Animation[name]);}))
                                    Burst.allEffects.splice(Burst.allEffects.indexOf(effect),1);
                            });
                            //Delete all buffers, some cannot delete
                            if (target.buffer.Hallucination) target.buffer={Hallucination:true};
                            else target.buffer={};
                        }
                    });
                }
                //Empty object {}, cannot spell
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    OpticalFlare:{
        name:"OpticalFlare",
        cost:{magic:75},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Shoot enemy unit
                var target=Game.getSelectedOne(location.x,location.y,true,true);
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to fire optical flare
                    this.moveToward(target,this.get('sight'),function(){
                        if (Resource.payCreditBill.call(myself)){
                            //Fire optical flare
                            var bullet=new Bullets.VultureBall({
                                from:myself,
                                to:target,
                                damage:0
                            });
                            myself.bullet=bullet;
                            bullet.fire(function(){
                                //Effect
                                var bufferObj={
                                    sight:target.radius()
                                };
                                if (target.status!='dead') target.addBuffer(bufferObj);
                                //Buffer flag
                                target.buffer.Blind=true;
                            });
                        }
                    });
                }
                //Empty object {}, cannot spell
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    SpiderMines:{
        name:"SpiderMines",
        enabled:false,
        spell:function(location){}
    },
    SeigeMode:{
        name:"SeigeMode",
        enabled:false,
        spell:function(){}
    },
    Cloak:{
        name:"Cloak",
        cost:{magic:25},
        enabled:false,
        spell:function(){
            Magic.PersonalCloak.spell.call(this);
        }
    },
    DefensiveMatrix:{
        name:"DefensiveMatrix",
        cost:{magic:100},
        credit:true,
        enabled:true,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Restore our units
                var target=Game.getSelectedOne(location.x,location.y,false,true,null,function(chara){
                    return !chara.buffer.DefensiveMatrix;//Not again
                });
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to activate defensive matrix
                    this.moveToward(target,250,function(){
                        if (Resource.payCreditBill.call(myself)){
                            //Defensive matrix animation
                            var anime=new Animation.DefensiveMatrix({target:target,callback:function(){
                                //Restore after 60 seconds, if no restoration executed, or interrupted by enemy attack
                                if (target.status!='dead' && anime.status!='dead' && target.buffer.DefensiveMatrix){
                                    if (target.removeBuffer(bufferObj)) delete target.buffer.DefensiveMatrix;
                                }
                            }});
                            //DefensiveMatrix sound
                            if (anime.insideScreen()) new Audio('bgm/Magic.DefensiveMatrix.wav').play();
                            //Defensive matrix effect: absorb 250 damage
                            var matrixHP=250;
                            var bufferObj={
                                calculateDamageBy:function(enemyObj){
                                    var damage;
                                    if (enemyObj instanceof Gobj){
                                        var enemyAttackType=enemyObj.attackType;
                                        if (!enemyAttackType && enemyObj.attackMode){
                                            enemyAttackType=(this.isFlying)?enemyObj.attackMode.flying.attackType:enemyObj.attackMode.ground.attackType;
                                        }
                                        damage=enemyObj.get('damage')*Unit.attackMatrix[enemyAttackType][this.unitType];
                                    }
                                    else damage=enemyObj;
                                    //Consume matrixHP
                                    matrixHP-=damage;
                                    //Fully absorb damage if matrixHP still remain
                                    if (matrixHP>0) return 0;
                                    else {
                                        anime.die();
                                        //Release remaining damage
                                        return -matrixHP;
                                    }
                                }
                            };
                            //Apply effect
                            target.addBuffer(bufferObj);
                            //Buffer flag
                            target.buffer.DefensiveMatrix=true;
                        }
                    });
                }
                //Empty object {}, cannot spell
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    EMPShockwave:{
        name:"EMPShockwave",
        cost:{magic:100},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire Plague
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,this.get('sight'),function(){
                    if (Resource.payCreditBill.call(myself)){
                        //Fire EMPShockwave
                        var bullet=new Bullets.SingleMissile({
                            from:myself,
                            to:{x:location.x,y:location.y}
                        });
                        myself.bullet=bullet;
                        //Fire EMPShockwave bullet with callback
                        bullet.fire(function(){
                            //EMP shockwave animation
                            var anime=new Animation.EMPShockwave({x:location.x,y:location.y});
                            //EMPShockwave sound
                            if (anime.insideScreen()) new Audio('bgm/Magic.EMPShockwave.wav').play();
                            //Get in range enemies
                            var targets=Game.getInRangeOnes(location.x,location.y,[90*1.2>>0,74*1.2>>0],true);
                            //Effect
                            targets.forEach(function(chara){
                                //Losing all shield and magic
                                if (chara.shield) chara.shield=0;
                                if (chara.magic) chara.magic=0;
                            });
                        });
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    Irradiate:{
        name:"Irradiate",
        cost:{magic:75},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Target enemy unit, animal unit
                var target=Game.getSelectedOne(location.x,location.y,true,true,null,function(chara){
                    return !(chara.isMachine()) && !chara.buffer.Irradiate;
                });
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    var irradiate=function(chara){
                        //Irradiate effect
                        var anime=new Animation.Irradiate({target:chara,callback:function(){
                            //Restore after 25 seconds, dealing 250 damage
                            if (chara.status!='dead' && chara.buffer.Irradiate){
                                if (chara.removeBuffer(bufferObj)) delete chara.buffer.Irradiate;
                                clearInterval(chara.dockTimer);
                                chara.dock();
                            }
                        }});
                        //Irradiate sound
                        if (anime.insideScreen()) new Audio('bgm/Magic.Irradiate.wav').play();
                        //Losing life over time and walk around
                        chara.buffer.Irradiate=true;//Flag
                        var bufferObj={
                            recover:function(){
                                //Get in range enemies and infect
                                Game.getInRangeOnes(chara.posX(),chara.posY(),50,true,true,null,function(chara){
                                    return !(chara.isMachine()) && !chara.buffer.Irradiate;
                                }).forEach(function(chara){
                                    irradiate(chara);
                                });
                                if (this.life>0) this.life-=10;//Refresh every 1 seconds
                                if (this.life<=0) this.die();
                            },
                            dock:Neutral.Bengalaas.prototype.dock
                        };
                        chara.addBuffer(bufferObj);
                        chara.dock();
                    };
                    //Move toward target to spell Irradiate
                    this.moveToward(target,300,function(){
                        if (Resource.payCreditBill.call(myself)){
                            irradiate(target);
                        }
                    });
                }
                //Empty object {}, cannot spell
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    Yamato:{
        name:"Yamato",
        cost:{magic:150},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Shoot all enemy
                var target=Game.getSelectedOne(location.x,location.y,true);
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to fire yamato
                    this.moveToward(target,this.get('sight'),function(){
                        if (Resource.payCreditBill.call(myself)){
                            //Fire yamato
                            var bullet=new Bullets.Yamato({
                                from:myself,
                                to:target,
                                damage:250
                            });
                            myself.bullet=bullet;
                            bullet.fire();
                            if (myself.insideScreen()) new Audio('bgm/HeroCruiser.attack.wav').play();
                        }
                    });
                }
                //Empty object {}, cannot spell
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    ScannerSweep:{
        name:"ScannerSweep",
        cost:{magic:50},
        credit:true,
        enabled:true,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                if (Resource.payCreditBill.call(this)){
                    //ScannerSweep animation
                    var anime=new Animation.ScannerSweep({x:location.x,y:location.y});
                    //ScannerSweep sound
                    if (anime.insideScreen()) new Audio('bgm/Magic.ScannerSweep.wav').play();
                }
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    ArmNuclearSilo:{
        name:"ArmNuclearSilo",
        cost:{
            mine:200,
            gas:200,
            man:8,
            time:600
        },
        enabled:true,
        spell:function(){
            Magic.NuclearStrike.enabled++;
        }
    },
    LiftOff:{
        name:"LiftOff",
        enabled:false,
        spell:function(){}
    },
    Land:{
        name:"Land",
        enabled:false,
        spell:function(location){}
    },

    //Protoss
    PsionicStorm:{
        name:"PsionicStorm",
        cost:{magic:75},
        credit:true,
        _timer:0,
        speller:{},
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire PsionicStorm
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,this.get('sight'),function(){
                    if (Resource.payCreditBill.call(myself)){
                        //PsionicStorm animation
                        var anime=new Animation.PsionicStorm({x:location.x,y:location.y});
                        //PsionicStorm sound
                        if (anime.insideScreen()) new Audio('bgm/Magic.PsionicStorm.wav').play();
                        //PsionicStorm effect
                        var targets=[];
                        Magic.PsionicStorm.speller=this;
                        //Psionic storm wave
                        var stormWave=function(){
                            targets=[];
                            //Check if any psionic storm exist
                            var psionicStorms=Burst.allEffects.filter(function(effect){
                                return effect instanceof Animation.PsionicStorm;
                            });
                            if (psionicStorms.length) {
                                //Get targets inside all of swarms
                                psionicStorms.forEach(function(storm){
                                    //Update buffer on enemy units inside storm
                                    targets=targets.concat(Game.getInRangeOnes(storm.posX(),storm.posY(),[94*1.2>>0,76*1.2>>0],null,true));
                                });
                                $.unique(targets);
                                //Effect
                                targets.forEach(function(chara){
                                    //Deal damage
                                    chara.getDamageBy(16);
                                    //Don't move, but will die if no life
                                    chara.reactionWhenAttackedBy(Magic.PsionicStorm.speller,true);
                                });
                                Magic.PsionicStorm._timer=setTimeout(stormWave,1000);
                            }
                            else Magic.PsionicStorm._timer=0;
                        };
                        //If not calculating, execute
                        if (!Magic.PsionicStorm._timer) stormWave();
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    Hallucination:{
        name:"Hallucination",
        cost:{magic:100},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Target all units
                var target=Game.getSelectedOne(location.x,location.y,null,true);
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to create 2 hallucinations
                    this.moveToward(target,245,function(){
                        if (Resource.payCreditBill.call(myself)){
                            //Hallucination effect
                            var anime=new Animation.Hallucination({target:target});
                            //Hallucination sound
                            if (anime.insideScreen()) new Audio('bgm/Magic.Hallucination.wav').play();
                            //Initial
                            var halluDamage, halluAttackMode, Hallucinations=[];
                            if (target.attack!=null) {
                                if (target.attackMode){
                                    halluAttackMode=_$.clone(target.attackMode);
                                    halluAttackMode.flying.damage=0;
                                    halluAttackMode.ground.damage=0;
                                }
                                else halluDamage=0;
                            }
                            //Combine temp constructor for hallucination
                            var halluConstructor=target.constructor.extends({
                                constructorPlus:function(props){},
                                prototypePlus:{
                                    //Override
                                    damage:halluDamage,//Might be undefined
                                    attackMode:halluAttackMode,//Might be undefined
                                    cost:{man:0},
                                    items:null,
                                    dieEffect:Burst.HallucinationDeath
                                }
                            });
                            for (var n=0;n<2;n++){
                                var hallucination=new halluConstructor({x:target.posX(),y:target.posY()});
                                Hallucinations.push(hallucination);
                            }
                            //Will disappear after 180 seconds
                            setTimeout(function(){
                                Hallucinations.forEach(function(chara){
                                    chara.die();
                                });
                            },180000);
                        }
                    });
                }
                //Empty object {}, cannot spell
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    Feedback:{
        name:"Feedback",//ManaBurn
        cost:{magic:50},
        credit:true,
        enabled:true,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Target enemy unit, magician
                var target=Game.getSelectedOne(location.x,location.y,true,true,null,function(chara){
                    return chara.MP;
                });
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to spell Feedback
                    this.moveToward(target,300,function(){
                        if (Resource.payCreditBill.call(myself)){
                            //Feedback effect
                            var anime=new Animation.Feedback({target:target});
                            //Feedback sound
                            if (anime.insideScreen()) new Audio('bgm/Magic.Feedback.wav').play();
                            //Deal damage same as its magic, lose all magic
                            target.getDamageBy(target.magic);
                            target.reactionWhenAttackedBy(myself);
                            target.magic=0;
                        }
                    });
                }
                //Empty object {}, cannot spell
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    MindControl:{
        name:"MindControl",
        cost:{magic:150},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Can control all enemy
                var target=Game.getSelectedOne(location.x,location.y,true);
                if (target instanceof Gobj){
                    var myself=this;
                    this.targetLock=true;
                    //Move toward target to mind control it
                    this.moveToward(target,280,function(){
                        if (Resource.payCreditBill.call(myself)){
                            //Mind control animation
                            var anime=new Animation.MindControl({target:target});
                            //MindControl sound
                            if (anime.insideScreen()) new Audio('bgm/Magic.MindControl.wav').play();
                            //Control and tame enemy
                            target.isEnemy=false;
                            //Order ours not to attack it anymore
                            Unit.allOurUnits().concat(Building.ourBuildings).forEach(function(chara){
                                if (chara.target==target) chara.stopAttack();
                            });
                            //Rearrange side: code piece from unit constructor
                            if (target.isFlying) {
                                Unit.enemyFlyingUnits.splice(Unit.enemyFlyingUnits.indexOf(target),1);
                                Unit.ourFlyingUnits.push(target);
                            }
                            else {
                                Unit.enemyGroundUnits.splice(Unit.enemyGroundUnits.indexOf(target),1);
                                Unit.ourGroundUnits.push(target);
                            }
                            //Freeze target
                            if (target.stopAttack) target.stopAttack();
                            target.dock();
                        }
                    });
                }
                //Empty object {}, cannot spell
                else delete Resource.creditBill;
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    MaelStorm:{
        name:"MaelStorm",
        cost:{magic:100},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire MaelStorm
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,this.get('sight'),function(){
                    if (Resource.payCreditBill.call(myself)){
                        //MaelStorm spell animation
                        var anime=new Animation.MaelStormSpell({x:location.x,y:location.y,callback:function(){
                            //Get in range enemy units, animal
                            var targets=Game.getInRangeOnes(location.x,location.y,[64*1.2>>0,64*1.2>>0],true,true,null,function(chara){
                                return !(chara.isMachine()) && !chara.buffer.MaelStorm;
                            });
                            //Freeze target
                            var bufferObj={
                                moveTo:function(){},
                                moveToward:function(){},
                                attack:function(){}
                            };
                            //Effect
                            targets.forEach(function(target){
                                target.dock();
                                if (target.stopAttack) target.stopAttack();
                                target.addBuffer(bufferObj);
                                //Buffer flag
                                target.buffer.MaelStorm=true;
                                //Mael storm effect
                                new Animation.MaelStorm({target:target,callback:function(){
                                    //Restore in 18 seconds
                                    if (target.status!='dead' && target.buffer.MaelStorm){
                                        if (target.removeBuffer(bufferObj)) delete target.buffer.MaelStorm;
                                    }
                                }});
                            });
                            //MaelStorm sound
                            if (anime.insideScreen()) new Audio('bgm/Magic.MaelStorm.wav').play();
                        }});
                        //MaelStormSpell sound
                        if (anime.insideScreen()) new Audio('bgm/Magic.StasisField.wav').play();
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    Scarab:{
        name:"Scarab",
        enabled:true,
        cost:{
            mine:15,
            time:70
        },
        spell:function(){
            this.scarabNum++;
            //Refresh to disabled
            Button.reset();
        }
    },
    Interceptor:{
        name:"Interceptor",
        enabled:true,
        cost:{
            mine:25,
            time:200
        },
        spell:function(){
            //Build interceptor
            this.continuousAttack.count++;
            //Refresh to disabled
            Button.reset();
        }
    },
    Recall:{
        name:"Recall",
        cost:{magic:150},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                var myself=this;
                if (Resource.payCreditBill.call(myself)){
                    //Recall animation
                    var anime=new Animation.Recall({x:location.x,y:location.y,callback:function(){
                        //Get in range our units
                        var targets=Game.getInRangeOnes(location.x,location.y,50*1.2>>0,false,true);
                        //Recall animation again
                        var animeII=new Animation.Recall({x:myself.posX(),y:myself.posY()});
                        //Recall sound
                        if (animeII.insideScreen()) new Audio('bgm/Magic.Recall.wav').play();
                        //Effect
                        targets.forEach(function(chara){
                            //Relocate targets
                            chara.x=myself.x;
                            chara.y=myself.y;
                        });
                    }});
                    //Recall sound
                    if (anime.insideScreen()) new Audio('bgm/Magic.Recall.wav').play();
                }
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    StasisField:{
        name:"StasisField",
        cost:{magic:100},
        credit:true,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire StasisField
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,this.get('sight'),function(){
                    if (Resource.payCreditBill.call(myself)){
                        //Spell StasisField animation
                        var anime=new Animation.StasisFieldSpell({x:location.x,y:location.y,callback:function(){
                            //Get in range units
                            var targets=Game.getInRangeOnes(location.x,location.y,64*1.2>>0,null,true);
                            //Effect:Freeze target
                            var bufferObj={
                                moveTo:function(){},
                                moveToward:function(){},
                                attack:function(){},
                                getDamageBy:function(){}
                            };
                            targets.forEach(function(target){
                                if (target.status!='dead'){
                                    //Buffer flag
                                    if (target.buffer.StasisField) return;//Not again
                                    target.buffer.StasisField=true;
                                    //Effect
                                    target.dock();
                                    if (target.stopAttack) target.stopAttack();
                                    //Freeze target
                                    target.addBuffer(bufferObj);
                                    //Stasis status
                                    target.stop();
                                    clearInterval(target.dockTimer);
                                    //Stasis field animation
                                    new Animation.StasisField({target:target,callback:function(){
                                        //Restore in 30 seconds
                                        if (target.status!='dead' && target.buffer.StasisField){
                                            if (target.removeBuffer(bufferObj)) {
                                                delete target.buffer.StasisField;
                                                target.dock();
                                            }
                                        }
                                    }});
                                }
                            });
                        }});
                        //StasisField sound
                        if (anime.insideScreen()) new Audio('bgm/Magic.StasisField.wav').play();
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    DisruptionWeb:{
        name:"DisruptionWeb",
        cost:{magic:125},
        credit:true,
        _timer:0,
        enabled:false,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire DisruptionWeb
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,this.get('sight'),function(){
                    if (Resource.payCreditBill.call(myself)){
                        //DisruptionWeb animation
                        var anime=new Animation.DisruptionWeb({x:location.x,y:location.y});
                        //DisruptionWeb sound
                        if (anime.insideScreen()) new Audio('bgm/Magic.DisruptionWeb.wav').play();
                        //Dynamic update targets every 1 second
                        var targets=[];
                        //Effect:Disable target attack
                        var bufferObj={
                            attack:function(){}
                        };
                        //Disruption web wave
                        var disruptionWeb=function(){
                            //Clear old units buffer
                            targets.forEach(function(chara){
                                chara.removeBuffer(bufferObj);
                            });
                            targets=[];
                            var disruptionWebs=Burst.allEffects.filter(function(effect){
                                return effect instanceof Animation.DisruptionWeb;
                            });
                            //Check if any disruption web exist
                            if (disruptionWebs.length) {
                                //Get targets inside all of webs
                                disruptionWebs.forEach(function(web){
                                    //Update buffer on enemy ground units inside web
                                    targets=targets.concat(Game.getInRangeOnes(web.posX(),web.posY(),[76*1.2>>0,56*1.2>>0],true,true,false));
                                });
                                $.unique(targets);
                                //Effect
                                targets.forEach(function(chara){
                                    //Cannot attack
                                    if (chara.attack) {
                                        chara.stopAttack();
                                        chara.addBuffer(bufferObj);
                                    }
                                });
                                Magic.DisruptionWeb._timer=setTimeout(disruptionWeb,1000);
                            }
                            else Magic.DisruptionWeb._timer=0;
                        };
                        //If not calculating, execute
                        if (!Magic.DisruptionWeb._timer) disruptionWeb();
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    },
    RechargeShields:{
        name:"RechargeShields",
        enabled:true,
        spell:function(location){
            //Has location callback info or nothing
            if (location){
                var myself=this;
                //Restore our units, have shield and in sight
                var target=Game.getSelectedOne(location.x,location.y,false,true,null,function(chara){
                    return chara.SP && myself.canSee(chara);
                });
                if (target instanceof Gobj){
                    //Recharge shield animation
                    var anime=new Animation.RechargeShields({target:target});
                    //Recharge shield sound
                    if (anime.insideScreen()) new Audio('bgm/Magic.RechargeShields.wav').play();
                    var hurt=target.get('SP')-target.shield;
                    var needMagic=(hurt/2+0.5)>>0;
                    //Remaining magic is sufficient
                    if (this.magic>needMagic) {
                        //Full recover
                        target.shield=target.get('SP');
                        this.magic-=needMagic;
                    }
                    //Remaining magic is not enough
                    else {
                        //Use all remaining magic
                        target.shield+=(this.magic*2);
                        this.magic=0;
                    }
                }
                else {
                    //Cannot reach target, pError
                }
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=_$.hitch(arguments.callee,this);
                $('div.GameLayer').attr('status','button');
            }
        }
    }
};