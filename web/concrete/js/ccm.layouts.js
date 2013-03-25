/** 
 * Free-Form Layouts
 */// plugins
jQuery.fn.ccmlayout=function(e){return this.each(function(){var t=$(this),n=t.data("ccmlayout");n||t.data("ccmlayout",n=new CCMLayout(this,e))})},jQuery.fn.ccmlayoutpresetdelete=function(e){return this.each(function(){$(this).on("click",function(){var t=$(this).attr("data-area-layout-preset-id");jQuery.fn.dialog.showLoader();var n=CCM_TOOLS_PATH+"/area/layout_presets?arLayoutPresetID="+t+"&task=submit_delete&ccm_token="+e.token;$.get(n,function(t){jQuery.fn.dialog.replaceTop(t),$(".delete-area-layout-preset").ccmlayoutpresetdelete(e);var n=CCM_TOOLS_PATH+"/area/layout_presets?task=get_list_json&ccm_token="+e.token;$.getJSON(n,function(t){var n=$(e.selector).data("ccmlayout");n._updatePresets(t),jQuery.fn.dialog.hideLoader()})})})})};var CCMLayout=function(e,t){this.options=$.extend({toolbar:"#ccm-layouts-toolbar",btnsave:"#ccm-layouts-save-button",btncancel:"#ccm-layouts-cancel-button",editing:!1,formview:"custom",supportsgrid:!1,gridrowtmpid:"ccm-theme-grid-temp"},t),this.$element=$(e),this.$toolbar=$(this.options.toolbar),this.$toolbar.prependTo(document.body),this._setupDOM(),this._activatePresets(),this.options.formview=="choosetype"?this._setupToolbarView(!0):this._setupToolbarView(),this._setupFormSaveAndCancel(),this._setupFormEvents();switch(this.options.formview){case"choosetype":this._updateChooseTypeForm(),this.usethemegrid?this._updateThemeGridView():this._updateCustomView();break;case"themegrid":this._updateThemeGridView();break;default:this._updateCustomView()}};CCMLayout.prototype._activatePresets=function(){var e=this,t=this.$toolbar.find(".ccm-dropdown-area-layout-presets li:not(.ccm-dropdown-area-layout-presets-manage) a");t.length>0&&!this.options.editing?(this.$toolbar.find("li[data-area-presets-view=presets]").show(),t.on("click",function(){var t=$(this).attr("data-area-layout-preset-id");jQuery.fn.dialog.showLoader();var n=CCM_TOOLS_PATH+"/area/layout_presets?arLayoutPresetID="+t+"&task=get_area_layout&ccm_token="+CCM_SECURITY_TOKEN;$.getJSON(n,function(t){parseInt(t.arLayout.arLayoutUsesThemeGridFramework)?(e.$usethemegrid.val(1),e.$selectgridcolumns.val(t.arLayout.arLayoutNumColumns)):e.$usethemegrid.val(0),e.$selectcolumnscustom.find("option[value="+t.arLayout.arLayoutNumColumns+"]").prop("selected",!0),e.$customspacing.val(t.arLayout.arLayoutSpacing),parseInt(t.arLayout.arLayoutIsCustom)?e.$customautomated.prop("checked",!1):e.$customautomated.prop("checked",!0),e._updateChooseTypeForm(),parseInt(t.arLayout.arLayoutUsesThemeGridFramework)?e._buildThemeGridGridFromPresetColumns(t.arLayoutColumns):(e._updateCustomView(),parseInt(t.arLayout.arLayoutIsCustom)&&($.each(t.arLayoutColumns,function(t,n){e.columnwidths.push(parseInt(n.arLayoutColumnWidth));var r=$(e.$element.find(".ccm-layout-column").get(t));r.css("width",n.arLayoutColumnWidth+"px"),$("#ccm-edit-layout-column-width-"+t).val(n.arLayoutColumnWidth)}),e._showCustomSlider())),jQuery.fn.dialog.hideLoader()})})):this.$toolbar.find("li[data-area-presets-view=presets]").hide()},CCMLayout.prototype._setupDOM=function(){this.$formviews=this.$toolbar.find("li[data-grid-form-view]"),this.$formviewcustom=this.$toolbar.find("li[data-grid-form-view=custom]"),this.$formviewchoosetype=this.$toolbar.find("li[data-grid-form-view=choosetype]"),this.$formviewthemegrid=this.$toolbar.find("li[data-grid-form-view=themegrid]"),this.$usethemegrid=this.$toolbar.find("select[name=useThemeGrid]"),this.$selectcolumnscustom=this.$toolbar.find("select[name=columns]"),this.$customspacing=this.$toolbar.find("input[name=spacing]"),this.$customautomated=this.$toolbar.find("input[name=isautomated]"),this.$selectgridcolumns=this.$toolbar.find("select[name=themeGridColumns]"),this.$savebtn=this.$toolbar.find(this.options.btnsave),this.$cancelbtn=this.$toolbar.find(this.options.btncancel),this.$slider=!1},CCMLayout.prototype._setupFormSaveAndCancel=function(){var e=this;this.$cancelbtn.on("click",function(){ccm_onInlineEditCancel(function(){e.$toolbar.remove()})}),this.$savebtn.on("click",function(){e.$toolbar.hide().prependTo("#ccm-block-form"),$("#ccm-block-form").submit()})},CCMLayout.prototype._setupToolbarView=function(e){var t=this;this.$formviews.each(function(n){$(this).attr("data-grid-form-view")!=t.options.formview&&(e?$(this).hide():$(this).remove())})},CCMLayout.prototype._updateChooseTypeForm=function(){this.usethemegrid=parseInt(this.$usethemegrid.val()),this.options.formview=="choosetype"&&this.usethemegrid?(this.$formviewcustom.hide(),this.$formviewthemegrid.show()):(this.$formviewthemegrid.hide(),this.$formviewcustom.show())},CCMLayout.prototype._setupFormEvents=function(){var e=this;this.$selectcolumnscustom.on("change",function(){e._updateCustomView()}),this.$customspacing.on("change",function(){e._updateCustomView()}),this.$customautomated.on("change",function(){e._updateCustomView()}),this.$selectgridcolumns.on("change",function(){e._updateThemeGridView()}),this.$usethemegrid.on("change",function(){e._updateChooseTypeForm(),e.usethemegrid?e._updateThemeGridView():e._updateCustomView()})},CCMLayout.prototype.buildThemeGridGrid=function(){this.$element.html("");var e=this.options.rowstart;e+='<div id="ccm-theme-grid-edit-mode-row-wrapper">';var t=this._getThemeGridColumnSpan(this.columns);$.each(t,function(t,n){var r='<div id="ccm-edit-layout-column-'+t+'" class="'+n.cssClass+' ccm-theme-grid-column" data-offset="0" data-span="'+n.value+'"><div class="ccm-layout-column-highlight"><input type="hidden" id="ccm-edit-layout-column-offset-'+t+'" name="offset['+t+']" value="0" /><input type="hidden" id="ccm-edit-layout-column-span-'+t+'" name="span['+t+']" value="'+n.value+'" /></div></div>';e+=r}),e+="</div>",e+=this.options.rowend,this.$element.append(e)},CCMLayout.prototype._updateThemeGridView=function(){this.columns=parseInt(this.$selectgridcolumns.val()),this.maxcolumns=parseInt(this.$selectgridcolumns.find(" option:last-child").val()),this.options.editing?this.$selectgridcolumns.prop("disabled",!0):this.buildThemeGridGrid(),this._resetSlider(),this.columns>1&&this._showThemeGridSlider()},CCMLayout.prototype._buildThemeGridGridFromPresetColumns=function(e){this.$element.html("");var t=this,n=this.options.rowstart;n+='<div id="ccm-theme-grid-edit-mode-row-wrapper">',$.each(e,function(e,t){var r='<div id="ccm-edit-layout-column-'+e+'" class="ccm-theme-grid-column" '+'data-offset="'+t.arLayoutColumnOffset+'" data-span="'+t.arLayoutColumnSpan+'"><div class="ccm-layout-column-highlight">'+'<input type="hidden" id="ccm-edit-layout-column-offset-'+e+'" name="offset['+e+']" value="'+t.arLayoutColumnOffset+'" /><input type="hidden" id="ccm-edit-layout-column-span-'+e+'" name="span['+e+']" value="'+t.arLayoutColumnSpan+'" /></div></div>';n+=r}),n+="</div>",n+=this.options.rowend,this.$element.append(n),this.columns=e.length,this.maxcolumns=parseInt(this.$selectgridcolumns.find(" option:last-child").val()),this._resetSlider(),this._redrawThemeGrid(),this._showThemeGridSlider()},CCMLayout.prototype._updateCustomView=function(){this.columns=parseInt(this.$selectcolumnscustom.val()),this.customspacing=this.$customspacing.val(),this.automatedcustomlayout=this.$customautomated.is(":checked"),this.columnwidths=[],this.columns<2?(this.$customspacing.prop("disabled",!0),this.$customautomated.prop("disabled",!0)):(this.$customspacing.prop("disabled",!1),this.$customautomated.prop("disabled",!1)),this.options.editing&&this.$selectcolumnscustom.prop("disabled",!0),this.options.editing||this.$element.html("");for(i=0;i<this.columns;i++){if(this.options.editing&&$("#ccm-edit-layout-column-"+i).length>0)continue;var e=$("<div />").attr("class","ccm-layout-column");e.attr("id","ccm-edit-layout-column-"+i);var t=$("<div />").attr("class","ccm-layout-column-highlight");t.append($("<input />",{name:"width["+i+"]",type:"hidden",id:"ccm-edit-layout-column-width-"+i})),e.append(t),this.$element.append(e)}var n=this.$element.find(".ccm-layout-column");if(this.columns<n.length)for(i=columns;i<n.length;i++)$("#ccm-edit-layout-column-"+i).remove();for(i=0;i<this.columns;i++){t=$("#ccm-edit-layout-column-"+i+" .ccm-layout-column-highlight"),i>0&&t.css("margin-left",this.customspacing/2+"px"),i+1<this.columns&&t.css("margin-right",this.customspacing/2+"px"),e=$("#ccm-edit-layout-column-"+i);if(e.attr("data-width")){var r=e.attr("data-width")+"px";this.columnwidths.push(parseInt(e.attr("data-width")))}else var r=100/this.columns+"%";e.css("width",r)}this._resetSlider(),!this.automatedcustomlayout&&this.columns>1&&this._showCustomSlider()},CCMLayout.prototype._resetSlider=function(){this.$slider&&this.$slider.slider("destroy"),$("#ccm-area-layout-active-control-bar").hasClass("ccm-area-layout-control-bar-add")&&$("#ccm-area-layout-active-control-bar").css("height","0px")},CCMLayout.prototype._getThemeGridColumnSpan=function(e){var t=Math.ceil(this.maxcolumns/e),n=[];for(i=0;i<e;i++)n[i]=t;var r=t*e;for(i=0;i<r-this.maxcolumns;i++){var s=n.length-i-1;n[s]--}var o=[];for(i=0;i<n.length;i++)o[i]={},o[i].cssClass=this.options.gridColumnClasses[n[i]-1],o[i].value=n[i];return o},CCMLayout.prototype._getThemeGridNearestValue=function(e,t){var n=null,r=null;for(var i=0;i<t.length;i++)if(t[i]<=e||t[i]>=e){var s=Math.abs(e-t[i]);if(r==null||s<r)n=t[i],r=s}return n},CCMLayout.prototype._showThemeGridSlider=function(){var e=this;e.$slider=$("#ccm-area-layout-active-control-bar"),e.$slider.css("height","12px");var t=[];for(i=0;i<e.columns;i++)c=$("#ccm-edit-layout-column-"+i),i==0?t.push(parseInt(c.width())):i+1==e.columns?t.push(parseInt(c.position().left)):(t.push(parseInt(c.position().left)),t.push(parseInt(c.width()+c.position().left)));var n=$("#ccm-area-layout-active-control-bar").width(),r=0,s=[],o=[],u=e.options.maxcolumns,a=e.options.gridColumnClasses[0];$("<div />",{id:e.options.gridrowtmpid}).appendTo(document.body);var f="";for(i=1;i<=u;i++)f+='<div class="'+a+'"></div>';$("#"+e.options.gridrowtmpid).append($(e.options.rowstart+f+e.options.rowend));var l=0;for(i=0;i<u;i++){var c=$($("#"+e.options.gridrowtmpid+" ."+a).get(i));if(i==0){var h=c.position().left;h<0&&(l=Math.abs(h))}s.push(parseInt(c.position().left+l)),o.push(parseInt(c.width()+c.position().left+l))}$("#"+e.options.gridrowtmpid).remove(),e.$slider.slider({min:0,max:n,step:1,values:t,slide:function(t,n){var r=$(n.handle).index(),i;r%2==0?i=o:i=s;var u=e.$slider.slider("values",r),a=e._getThemeGridNearestValue(n.value,i),f=!0;$.each(n.values,function(e,t){a>=t&&r<e?f=!1:a<=t&&r>e&&(f=!1)});if(f){e.$slider.slider("values",r,a);if(u!=a){if(r%2==0){var l=Math.floor(r/2);$innercolumn=$("#ccm-edit-layout-column-"+l);var c=parseInt($innercolumn.attr("data-span")),h=$innercolumn.nextAll(".ccm-theme-grid-column:first"),p=h.attr("data-offset");p?p=parseInt(p):p=0,a>u?(c++,p--):(c--,p++)}else{var l=Math.ceil(r/2);$innercolumn=$("#ccm-edit-layout-column-"+l);var c=parseInt($innercolumn.attr("data-span")),h=$innercolumn,p=h.attr("data-offset");p?p=parseInt(p):p=0,a<u?(c++,p--):(c--,p++)}h.attr("data-offset",p),$innercolumn.attr("data-span",c),e._redrawThemeGrid()}}return!1}})},CCMLayout.prototype._redrawThemeGrid=function(){var e=this;e.$element.find(".ccm-theme-grid-offset-column").remove(),$.each(e.$element.find(".ccm-theme-grid-column"),function(t,n){var r=$(n);r.removeClass().addClass("ccm-theme-grid-column"),e.options.editing&&r.addClass("ccm-theme-grid-column-edit-mode");if(r.attr("data-span")){var i=parseInt(r.attr("data-span"))-1;r.addClass(e.options.gridColumnClasses[i]),$("#ccm-edit-layout-column-span-"+t).val(parseInt(r.attr("data-span")))}if(r.attr("data-offset")){var s=parseInt(r.attr("data-offset"))-1;$("<div />",{"data-offset-column":!0}).addClass("ccm-theme-grid-offset-column").addClass(e.options.gridColumnClasses[s]).insertBefore(r),$("#ccm-edit-layout-column-offset-"+t).val(parseInt(r.attr("data-offset")))}})},CCMLayout.prototype._showCustomSlider=function(){this.$slider=$("#ccm-area-layout-active-control-bar"),this.$slider.css("height","12px");var e=[],t=0,n=this.$slider.width(),r=this.$element.find(".ccm-layout-column");if(this.columnwidths.length>0)for(i=0;i<this.columnwidths.length-1;i++)t+=this.columnwidths[i],e.push(t);else{var s=n/this.columns;for(i=1;i<this.columns;i++)t+=s,e.push(t)}this.$slider.slider({min:0,max:n,step:1,values:e,create:function(t,i){var s=0,o=[];$.each(r,function(t,i){var o=e[t];if(t+1==r.length)var u=n-s;else var u=o-s;var u=Math.floor(u);$(i).find("#ccm-edit-layout-column-width-"+t).val(u),s=o})},slide:function(e,t){var i=0,s=!0;$.each(t.values,function(e,t){t<i&&(s=!1),i=t});if(!s)return!1;i=0,$.each(r,function(e,s){if(e+1==r.length)var o=n-i;else var o=t.values[e]-i;var o=Math.floor(o);$(s).find("#ccm-edit-layout-column-width-"+e).val(o),$(s).css("width",o+"px"),i=t.values[e]})}})},CCMLayout.prototype._updatePresets=function(e){var t=this.$toolbar.find(".ccm-dropdown-area-layout-presets");t.find("li:not(.ccm-dropdown-area-layout-presets-manage)").remove(),$.each(e,function(e,n){t.prepend('<li><a href="javascript:void(0)" data-area-layout-preset-id='+n.arLayoutPresetID+'">'+n.arLayoutPresetName+"</a></li>")}),this._activatePresets()},CCMLayout.launchPresets=function(e,t,n){var r=CCM_TOOLS_PATH+"/area/layout_presets?ccm_token="+t;n&&(r+="&task="+n),jQuery.fn.dialog.open({width:280,height:200,modal:!1,href:r,title:ccmi18n.areaLayoutPresets,onOpen:function(){$("#ccm-layout-save-preset-form select").on("change",function(e){$(this).val()=="-1"?($("#ccm-layout-save-preset-name").show().focus(),$("#ccm-layout-save-preset-override").hide()):($("#ccm-layout-save-preset-name").hide(),$("#ccm-layout-save-preset-override").show())}).trigger("change"),$(".delete-area-layout-preset").ccmlayoutpresetdelete({selector:e,token:t}),$("#ccm-layout-save-preset-form").on("submit",function(){$.fn.dialog.showLoader();var t=$(e).data("ccmlayout"),n=t.$toolbar.find("select, input").serializeArray().concat(t.$element.find("input").serializeArray()).concat($("#ccm-layout-save-preset-form").serializeArray());return n.push({name:"submit",value:1}),$.ajax({url:r,type:"POST",data:n,dataType:"json",success:function(e){$.fn.dialog.hideLoader(),$.fn.dialog.closeAll(),t._updatePresets(e)}}),!1})}})};