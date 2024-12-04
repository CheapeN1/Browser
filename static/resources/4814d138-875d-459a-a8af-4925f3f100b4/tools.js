/*******************
 DATE FUNCTIONS
 ********************/
String.prototype.paddingLeft = function(lng, paddingValue) {
	var str = this;
	if(paddingValue == undefined) {
		paddingValue = "0";
	}
	while(str.length < lng) str = paddingValue + str;
	return str;
};
Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
};
var icheck_checbox_class = "icheckbox_minimal-blue";
var icheck_radio_class = "iradio_minimal-blue";
var icheck_area = "20%";
var currencyStatusTimeout = null;
var lazyLoadInstance = null;
/*******************
 DOCUMENT READY INITIALIZERS
 ********************/
$(function() {
	//YUKARI CIK BUTONU
	$("#go_up").click(function() {
		$("html,body").stop().animate({scrollTop: "0"}, 500);
	});
	$(window).scroll(function() {
		if($(document).scrollTop() > 300)
			$("#go_up").addClass("open").fadeIn(500);
		else
			$("#go_up").removeClass("open").fadeOut(500);
	});
	formValidate(".formValidate");
	initIntlPhoneMask();
	initSelects();
	initICheck();
	initAutoNumeric();
	initBootstrapSwitch();
	if($.blockUI) {
		$.blockUI.defaults.message = '<p class="round">\n' +
			'  <span class="ouro ouro3">\n' +
			'    <span class="left"><span class="anim"></span></span>\n' +
			'    <span class="right"><span class="anim"></span></span>\n' +
			'  </span></p>';
		$.blockUI.defaults.css.backgroundColor="transparent";
		$.blockUI.defaults.css.border=0;
	}
	if($.fn.birthdayPicker) {
		$(".birthday").birthdayPicker();
	}
	if(typeof LazyLoad !== "undefined") {
		lazyLoadInstance = new LazyLoad({
			elements_selector: ".lazyload"
		});
	}
	if($.fn.hierarchicalSelector) {
		$(".categoryselector").hierarchicalSelector();
	}
	if($.fancybox) {
		$(".fancybox").fancybox();
	}
	if($.matchHeight) {
		$(".matchHeight").matchHeight();
	}
	if($.fn.tooltip) {
		$('[data-toggle="tooltip"]').tooltip();
	}
	if($.fn.autocomplete) {
		$(".autocomplete").each(function(i, o) {
			let self = this;
			$(o).autocomplete({
				source: function(request, response) {
					var data = {};
					if($(self).data('ajax-data')) {
						data = eval($(self).data('ajax-data'));
					}
					data["searchterm"] = request.term;
					getAjax($(self).data("ajax-url"), function(result) {
							if(result.responseJSON) {
								response(result.responseJSON);
							}
						},
						data);
				},
				minLength: $(self).data('min') ? $(self).data('min') : 1,
				delay: $(self).data('delay') ? $(self).data('delay') : 100,
				//select: function(event, ui) {}
			});
		});
	}
	if($.fn.tagsinput) {
		$(".tags").each(function(i, o) {
			let self = this;
			$(o).tagsinput({
				trimValue: true,
				confirmKeys: [13, 32, 188, 16],
				// tagClass: function(item) {
				// 	return (item.length > 10 ? 'big' : 'small');
				// },
				onTagExists: function(item, $tag) {
					$tag.hide().fadeIn();
				}
			});
		});
	}
	if($.fn.chosentree) {
		//<div class="selecttree" data-root-label="Kategoriler" data-input-label="Kategoriler" data-input-type="radio" data-input-name="idcategory[]" data-ajax-url="<?=base_url($module_group_code . "/" . $controller . '/getcategorybyparentid')?>"></div>
		$(".selecttree").each(function(i, o) {
			let self = this;
			$(o).chosentree({
				width: 500,
				label: $(self).data('input-label') ? $(self).data('input-label') : "",
				showtree: false,
				inputName: $(self).data('input-name') ? $(self).data('input-name') : "dummy",
				autoSelectChildren: false,
				inputType: $(self).data('input-type') ? $(self).data('input-type') : "radio",
				load: function(node, callback) {
					if(node.id == 0) {
						node.id = 1;
						node.title = $(self).data('root-label') ? $(self).data('root-label') : "Kategoriler";
						node.has_children = true;
						node.level = 0;
						node.children = [];
					}
					var data = {};
					if($(self).data('ajax-data')) {
						data = eval($(self).data('ajax-data'));
					}
					data["idparent"] = node.id;
					getAjax($(self).data("ajax-url"), function(result) {
							if(result.responseJSON) {
								$.each(result.responseJSON, function(j, m) {
									node.children.push({
										id: parseInt(m.id),
										title: m.title,
										has_children: m.has_children === "1",
										level: node.level + 1,
									});
								});
								callback(node);
							}
						},
						data);
				}
			});
		});
	}
	if($.datetimepicker) {
		$.datetimepicker.setLocale(getLocale());
		$('.datetimepicker').datetimepicker({
			format: 'd/m/Y H:i',
			dayOfWeekStart: 1
		});
		$('.datepicker').datetimepicker({
			locale: 'tr',
			format: 'DD/MM/YYYY',
			viewMode: 'years',
			maxDate: 'now'
		});
	}
	if($.fn.timepicker) {
		if($(".timepicker-24").length > 0) {
			$(".timepicker-24").each(function() {
				let options = {
					autoclose: true,
					allowInputToggle: true,
					minuteStep: 5,
					showSeconds: false,
					showMeridian: false,
					use24hours: true,
				};
				$.extend(true, options, $(this).data());
				if($(this).val()) {
					options["defaultTime"] = $(this).val();
				}
				$(this).timepicker(options);
			});
		}
	}
	if($.fn.datepicker) {
		if($(".date-picker").length > 0) {
			$(".date-picker").each(function() {
				let options = {
					format: "dd/mm/yyyy",
					orientation: "bottom right",
					autoclose: true,
					language: "tr"
				};
				$.extend(true, options, $(this).data());
				$(this).datepicker(options)
				.on("changeDate", function(e) {
					var formValidation = $(this).parents("form").data("formValidation");
					if(formValidation) {
						formValidation.revalidateField($(this));
					}
				});
			});
		}
	}
	if($.fn.bootstrapSwitch) {
		$('.make-switch').bootstrapSwitch();
	}
	if($.fn.colorpicker) {
		$('.colorpicker').colorpicker().on('changeColor.colorpicker', function(event) {
			$(this).removeAttr("style").attr("style", 'background-color:' + event.color.toString() + ' !important');
		});
		$('.colorpicker').each(function() {
			if($(this).val()) {
				$(this).removeAttr("style").attr("style", 'background-color:' + $(this).val() + ' !important');
			}
		});
	}
	if(typeof WOW !== 'undefined') {
		new WOW().init();
	}
	UpdateOrderSummary();
	$("#paymentTypeSelection .tab-pane").each(function(i, o) {
		if(!$(o).hasClass("active")) {
			$(o).find(":input").prop("disabled", true);
		}
	});
	$("#btnPay").html($('#paymentTypeSelection a:first').text() + " ile Öde");
	$('#paymentTypeSelection').on('shown.bs.tab', function(e) {
		UpdateIcheck(".cargo_selection", "uncheck");
		$(e.currentTarget).find(":input").prop("disabled", true);
		$(e.target.hash).find(":input").prop("disabled", false);
		$(e.target.hash).find(".cargo_selection").first().iCheck("check");
		$(e.target.hash).find(".cargo_selection").first().iCheck("update");
		$(e.target.hash).find(".idaccount").first().iCheck("check");
		$(e.target.hash).find(".idaccount").iCheck("update");
		$("#idpaymenttype").val($(e.target.hash).data("idpaymenttype"));
		$("#btnPay").html(e.target.innerText + " ile Öde");
	});
	$("#newsletter-form button").on("click", function() {
		var mail = $("#newsletter-form #newsletter_email").val();
		if(mail) {
			getAjax(base_url("registernewsletter"), function(o) {
				if(o.responseJSON) {
					var result = o.responseJSON;
					if(result.IsSuccessful) {
						alert("E-posta adresiniz başarılı bir şekilde kaydedildi!")
					} else {
						alert(result.Message);
					}
				}
			}, {
				mail: mail
			});
		}
	});
	/*******************
	 PAYMENT
	 ********************/
	if($.fn.mask) {
		$(".phoneMask").mask("0(999) 999-9999");
		$(".cardCVCMask").mask("999");
		$(".creditCardMask").mask("9999-9999-9999-9999")
		.on("keydown", function(e) {
			if($(this).val().length == 8 && $("#instalments table").length == 0) {
				var cardbin = $(this).val().replace(/\-/gi, "").substr(0, 6);
				CreateInstalmentTable(cardbin);
			} else if($(this).val().length < 7) {
				$("#instalments").addClass("alert alert-info").html($("#instalments").data("placeholder"));
			}
		}).on("change", function(e) {
			if($(this).val().length == 8 && $("#instalments table").length == 0) {
				var cardbin = $(this).val().replace(/\-/gi, "").substr(0, 6);
				CreateInstalmentTable(cardbin);
			} else if($(this).val().length < 7) {
				$("#instalments").addClass("alert alert-info").html($("#instalments").data("placeholder"));
			}
		});
	}
	// Taksit uyarısı
	$("#instalments").html($("#instalments").data("placeholder"));
	$(".instalment_selection").on('ifChecked', function(event) {
		UpdateOrderSummary();
	});
	/*******************
	 MODALS
	 ********************/
	$(document).on("click", ".ajaxModal", function() {
		let modal = $(tmpl("ajax_modal_template", {}));
		if($(this).data('modal-class')) {
			$(modal).addClass($(this).data('modal-class'));
		}
		if($(this).data('header-class')) {
			$(modal).find(".modal-header").addClass($(this).data('header-class'));
		}
		var data = null;
		if($(this).data('ajax-data')) {
			data = eval($(this).data('ajax-data'));
		}
		$(modal).find(".modal-title").html($(this).data('title'));
		if(!$(this).data('content')) {
			getAjax($(this).data('ajax-url'), function(result) {
				if(result) {
					$(modal).find(".modal-body").html(result.responseText);
				}
			}, data);
		} else {
			$(modal).find(".modal-body").html($(this).data('content'));
		}
		$(this).data('footer') && $(this).data('footer') == true ? $(modal).find(".modal-footer").removeClass('hide') : $(modal).find(".modal-footer").addClass('hide');
		$(modal).on('hide.bs.modal', function() {
			if($(this).data('on-close')) {
				eval($(this).data('on-close'));
			}
			$(modal).fadeOut(500, function() {
				$(modal).remove();
			})
		});
		if($(this).data('on-show')) {
			$(modal).on('show.bs.modal', eval($(this).data('on-show')));
		}
		$(modal).on('shown.bs.modal', function() {
			if($(this).data('on-shown')) {
				eval($(this).data('on-shown'));
			}
			initSelects(".modal[role='ajaxModal']:last");
			if(lazyLoadInstance)
				lazyLoadInstance.update();
			if($.fancybox) {
				$(".fancybox").fancybox();
			}
		});
		$("body").append($(modal));
		$(modal).modal('show');
	});
	$(document).on("click", ".alertModal", function() {
		showAlert($(this).data('content'), $(this).data('title'), $(this).data('modal-class'), $(this).data('ajax-url'), $(this).data('postdata'));
	});
	$(document).on("click", ".requireConfirmModal", function() {
		$('#confimActionTitle').html($(this).data('confirm-title'));
		$('#confimActionMessage').html($(this).data('confirm-message'));
		$('#confimAction').attr("onclick", $(this).data('confirm-action'));
		$('#confirmActionModal').modal('show');
	});
	/*******************
	 CHARTS
	 ********************/
	$(".barchart").each(function() {
		barChart($(this).attr("id"));
	});
	/*******************
	 LOGIN
	 ********************/
	if($("#rememberme").length > 0) {
		Remember();
	}
	// Inputs Placeholder Efect
	if($(".input-ap:input").length > 0) {
		setTimeout(function() {
			$(".input-ap:input").each(function() {
				var InputName = $(this);
				var val = "";
				if(InputName.val() != "") {
					val = InputName.val()
				} else {
					val = $.cookie(InputName.attr('name'));
				}
				if(!val || val == "") {
					InputName.removeClass("animated-input");
				} else {
					InputName.val(val).addClass("animated-input");
				}
			});
		}, 1000);
	}
	$(document).on("focus", ".input-ap", function(e) {
		$(this).addClass("animated-input");
	});
	$(document).on("blur", ".input-ap", function(e) {
		var valcontrol = $(this).val();
		var thisIndex;
		var thisValues;
		thisIndex = $.inArray(this, $(".input-ap"));
		if(valcontrol == "") {
			$(this).removeClass("animated-input");
		}
		setTimeout(function() {
			thisValues = $(".input-ap:eq(" + thisIndex + ")").val();
			if(thisValues != "") {
				$(".input-ap:eq(" + thisIndex + ")").addClass("animated-input");
			}
		}, 200);
	});
	/*******************
	 VOTE STARS
	 ********************/
	$('#stars li').on('mouseover', function() {
		var onStar = parseInt($(this).data('value'), 10); //
		$(this).parent().children('li.star').each(function(e) {
			if(e < onStar) {
				$(this).addClass('hover');
			} else {
				$(this).removeClass('hover');
			}
		});
	}).on('mouseout', function() {
		$(this).parent().children('li.star').each(function(e) {
			$(this).removeClass('hover');
		});
	});
	$('#stars li').on('click', function() {
		var onStar = parseInt($(this).data('value'), 10);
		var stars = $(this).parent().children('li.star');
		for(i = 0; i < stars.length; i++) {
			$(stars[i]).removeClass('selected');
		}
		for(i = 0; i < onStar; i++) {
			$(stars[i]).addClass('selected');
		}
		$(".rating-stars .errorMessage").hide(200);
		var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
		$("#rating").val(ratingValue);
	});
	/*******************
	 VOTE STARS END
	 ********************/
	$("#comment-form").on("submit", function(e) {
		if($("#rating").val() == 0) {
			$(".rating-stars .errorMessage").show(200);
			e.preventDefault(); //prevent the default action
		}
	});
	ShowPoll();
	UpdateCurrencyStatus();
});

/*******************
 GENERAL FUNCTIONS
 ********************/
function getLocale() {
	return site_lang;
}

function getCurrentLocale() {
	return site_locale;
}

function getCurrentUILocale() {
	return site_uilocale;
}

function base_url(url) {
	return str_base_url + (url === undefined ? "" : "/" + url);
}

function site_url(url) {
	return str_site_url + (url === undefined ? "" : url);
}

function uploads_url(module_code, id, filename) {
	return uriToUpload + module_code + "/" + id + "/" + filename;
}

function uploads_thumbs_url(module_code, id, filename) {
	return uriToUpload + module_code + "/" + id + "/thumbnail/" + filename;
}

function get_img_url_by_module(module_code, id, filename, params) {
	return site_url("img/" + (params === undefined ? "-" : params) + "/module/" + module_code + "/" + id + "/" + filename);
}

function get_img_url_by_id(filename_or_id, params) {
	return site_url("img/" + (params === undefined ? "-" : params) + "/id/" + filename_or_id);
}

function get_img_url(filepath, params) {
	return site_url("img/" + (params === undefined ? "-" : params) + filepath);
}

function base_controller(url) {
	return base_url(controller) + (url === undefined ? "" : "/" + url);
}

function call_controller_method(url) {
	return base_url(controllerPath) + (url === undefined ? "" : "/" + url);
}

function showAlert(content, title, className, ajaxUrl, postData) {
	$('#alertModalTitle').html(title !== undefined ? title : translate_alert_title);
	if(!content) {
		getAjax(ajaxUrl, function(result) {
			if(result) {
				$('#alertModalmessage').html($.parseJSON(result.responseText).content);
			}
		}, postData !== undefined ? eval(postData) : null);
	} else {
		$('#alertModalmessage').html(content);
	}
	$('#alertModal').addClass(className !== undefined ? className : "").modal('show');
}

function getAjax(url, complete, data, async, datatype) {
	if(async === undefined) {
		async = true;
	}
	if(datatype === undefined) {
		datatype = "json";
	}
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		async: async,
		dataType: datatype,
		cache: false,
		complete: function(opresult) {
			complete(opresult);
			result = opresult;
		},
		fail: function(jqXHR, textStatus, errorThrown) {
			if(enable_debugging) {
				console.log("Could not get posts, server response: " + textStatus + ": " + errorThrown);
			}
		}
	});
}

function GetAddressId() {
	return {addressid: $("#invoiceAddress").val()};
}

function dataToOptions(selector, data, id, name) {
	var obj = $(selector);
	$.each(data, function(i, o) {
		obj.append($("<option/>").attr("value", o[id]).html(o[name]));
	});
}

function formValidate(selector) {
	$(selector).each(function(i, o) {
		$(o).formValidation({
			framework: 'bootstrap', //excluded: ":disabled",
			icon: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			locale: getCurrentLocale(),
			submitHandler: function(form) {
				ShowProcessingModal();
			},
			fields: {
				".intlPhoneMask": { // Formlarda inputlar required attribute almamalı, class olarak required eklenmeli
					selector: ".intlPhoneMask",
					validators: {
						callback: {
							message: enter_valid_phone_number,
							callback: function(value, validator, $field) {
								if(!$field.hasClass("required")) {
									return value === '' || $field.intlTelInput('isValidNumber');
								} else {
									return $field.intlTelInput('isValidNumber');
								}
							}
						}
					}
				},
			}
		});
	});
}

/*******************
 PAYMENT FUNCTIONS
 ********************/
function CreateInstalmentTable(cardbin) {
	var cargoprice = 0;
	if($(".cargo_selection").length > 0) {
		cargoprice = $(".cargo_selection:input:checked").data("price");
	}
	let data = {
		cardbin: cardbin,
		cargoprice: cargoprice
	};
	if($("#paytotal").length > 0) {
		data["paytotal"] = $("#paytotal").val();
	}
	getAjax(base_url("getcardinfo"), function(o) {
		if(o.responseJSON) {
			var result = o.responseJSON;
			if(result.IsSuccessful) {
				if(result.Data) {
					var data = result.Data;
					var instalmentsrable = $("#instalments");
					instalmentsrable.removeClass("alert alert-info").html("");
					if(data.cardinfo) {
						instalmentsrable.append("<div class=\"form-row\">" + data.cardinfo.bankname + "-" + data.cardinfo.type + "</div>")
					}
					if(data.pos) {
						instalmentsrable.append("<div class=\"form-row\">" + data.pos.name + "<input type='hidden' name='idpos' value='" + data.pos.idpos + "' /></div>")
					}		//ccnumber exists
					if(data.instalments) {
						var table = $("<table class=\"table table-striped table-bordered table-hover m-t-10\" />");
						table.append("<thead>" + "<tr>" + "<th>Taksit Sayısı</th>" + "<th>Taksit Tutarı</th>" + "<th>Toplam Tutar</th>" + "</tr>" + "</thead>");
						var tbody = $("<tbody/>");
						table.append(tbody);
						$.each(data.instalments, function(ind, inst) {
							tbody.append("<tr>" + "<td>" + "<div class=\"mt-radio-inline \">" + "<label class=\"mt-radio mt-radio-outline\">" + "<input type=\"radio\" name=\"instalment\" value=\"" + inst.instalment + "\" class=\"icheck instalment_selection\" " + (inst.instalment == 1 ? "checked" : "") + " > " + (inst.instalment == 1 ? "Peşin" : inst.name) + "<span></span>" + "</label>" + "</div>" + "</td>" + "<td>" + inst.monthly + " <i class=\"fa fa-try\"></i></td>" + "<td>" + inst.total + " <i class=\"fa fa-try\"></i></td>" + "</tr>");
						});
						//3D ve classic metod varsa seçenek sunulur
						var tfoot = "<tfoot>" + "<tr>" + "<th colspan='3'>";
						if(data.pos.hasClassic == "1" && data.pos.has3D == "1") {
							tfoot += "<input type='checkbox' id='method' name='method' value='3D' /> <label for='method'>" + i_want_to_use_3d_secure + "</label>";
						} else if(data.pos.hasClassic == "1") {
							tfoot += "<input type='hidden' id='method' name='method' value='classic' />"; // default classic
						} else if(data.pos.has3D == "1") {
							tfoot += "<input type='hidden' id='method' name='method' value='3D' />"; // default 3D
						}
						tfoot += "</th>" + "</tr>" + "</tfoot>";
						table.append(tfoot);
						instalmentsrable.append(table).find(':input.icheck').iCheck({
							checkboxClass: 'icheckbox_square-orange',
							radioClass: 'iradio_square-orange',
							increaseArea: '20%' // optional
						});
					}
				}
			} else {
				alert(result.Message);
			}
		}
	}, data);
}

function UpdateOrderSummary() {
	var cargoprice = 0;
	//Kargo ücreti varsa
	if($(".cargo_selection").length > 0) {
		cargoprice = $(".cargo_selection:input:checked").data("price");
		var pricetext = numberWithCommas(parseFloat(Math.round(cargoprice * 100) / 100).toFixed(2)) + " <i class='" + $("#cargototal").data("currency") + "'></i>";
		$("#cargoprice").val(cargoprice);
		$("#cargototal").html(pricetext);
	}
	var grandtotal = parseFloat(cargoprice);
	$(".carttotals").each(function() {
		if($(this).attr("id") != "cargototal" && $(this).attr("id") != "grandtotal") {
			grandtotal = grandtotal + parseFloat($(this).data("total").toString().replace(",", ""));
		}
	});
	var grandTotalText = numberWithCommas(parseFloat(parseFloat(Math.round(grandtotal * 100) / 100)).toFixed(2)) + " <i class='" + $("#grandtotal").data("currency") + "'></i>";
	$("#grandtotal").html(grandTotalText);
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function UpdateIcheck(selector, status) {
	if($(selector).length > 0) {
		$(selector).iCheck(status);
		$(selector).iCheck('update');
	}
}

function SelectFirstIcheck(selector) {
	if($(selector).length > 0) {
		$(selector).first().iCheck("check");
		$(selector).first().iCheck('update');
	}
}

/*******************
 LOGIN FUNCTIONS
 ********************/
function Remember() {
	if($.cookie("email") && $("#login-form #email").length > 0) {
		$("#login-form #email").val($.cookie("email"));
		$("#rememberme").prop("checked", "checked");
	}
	if($.cookie("name") && $("#login-form #name").length > 0) {
		$("#login-form #name").val($.cookie("name"));
		$("#rememberme").prop("checked", "checked");
	}
}

function DoRemember() {
	if($("#login-form #email").length > 0) {
		$("#rememberme").is(":checked") ? $.cookie("email", $("#login-form #email").val(), 10000) : $.removeCookie('email');
	}
	if($("#login-form #name").length > 0) {
		$("#rememberme").is(":checked") ? $.cookie("name", $("#login-form #name").val(), 10000) : $.removeCookie('name');
	}
}

/*******************
 DATATABLES
 ********************/
function CreatePrivateDataTable(dataTableId, aaColDefs, showCount, paging, search) {
	var dataTable = null;
	if($.fn.dataTable.isDataTable(dataTableId)) {
		dataTable = $(dataTableId).DataTable();
		dataTable.ajax.reload();
	} else {
		// LoadDataTable(function() {
		var cols = [];
		var sortedCols = [];
		if(aaColDefs === undefined) {
			aaColDefs = [];
		}
		getAjax($(dataTableId).data("ajax-url"), function(result) {
			if(result.responseJSON) {
				var coldef = result.responseJSON;
				if(coldef.length > 0) {
					var thead = $(dataTableId).find("thead");
					var tr = $("<tr/>");
					var aLengthMenu = [[50, 100, 250, 500, -1], [50, 100, 250, 500, "Hepsi"]];
					thead.append(tr);
					$.each(coldef, function(index, col) {
						if(col.hasOwnProperty("sortable")) {
							if(col.sortable == true) {
								cols.push(null);
							} else {
								cols.push({"bSortable": false});
							}
						} else {
							cols.push({"bSortable": false});
						}
						if(col.hasOwnProperty("sort")) {
							sortedCols.push([index, col.sort]);
						}
						aaColDefs.push({
							aTargets: [index],
							sClass: "col_" + (col.name == "" ? col.id : col.name) + " " + (col.hasOwnProperty("class") ? col.class : "")
						});
						if(col.hasOwnProperty("width") && col.width != 0 && col.width != "0") {
							if(col.width.indexOf("px") == -1) {
								col.width = col.width + "px";
							}
							aaColDefs.push({
								aTargets: [index],
								sWidth: col.width
							});
						}
						if(col.hasOwnProperty("visible")) {
							if(col.visible == false) {
								aaColDefs.push({
									aTargets: [index],
									bVisible: false
								});
							}
						}
						var th = $("<th/>");
						if(col.hasOwnProperty("title")) {
							th.html(col.title);
						}
						if(col.hasOwnProperty("html")) {
							th.html(col.html);
						}
						if(col.hasOwnProperty("id")) {
							th.attr("id", col.id);
						}
						if(col.hasOwnProperty("name")) {
							th.attr("name", col.name);
						}
						if(col.hasOwnProperty("type")) {
							switch(col.type) {
								case "datetime":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: CreateDateTimeColumn
									});
									break;
								case "date":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: CreateDateColumn
									});
									break;
								case "time":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: CreateTimeColumn
									});
									break;
								case "status":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: CreateStatusColumn
									});
									break;
								case "yesno":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: CreateYesNoColumn
									});
									break;
								case "gender":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: CreateGenderColumn
									});
									break;
								case "icon":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: CreateIconColumn
									});
									break;
								case "image":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: CreateImageColumn
									});
									break;
								case "flag":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: CreateFlagColumn
									});
									break;
								case "recordstatus":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: CreateRecordStatusColumn
									});
									break;
								case "texttrim":
									aaColDefs.push({
										aTargets: [index],
										fnCreatedCell: TrimText
									});
									break;
								case "custom":
									if(col.hasOwnProperty("cellFormatter")) {
										aaColDefs.push({
											aTargets: [index],
											fnCreatedCell: eval(col.cellFormatter)
										});
									}
									break;
								default:
									break;
							}
						}
						tr.append(th);
					});
					var bPaginate = true;
					if($(dataTableId).attr("data-paginate")) {
						bPaginate = $(dataTableId).data("paginate");
					}
					var sInfo = true;
					if($(dataTableId).attr("data-info")) {
						sInfo = $(dataTableId).data("info");
					}
					var sSearching = true;
					if($(dataTableId).attr("data-searching")) {
						sSearching = $(dataTableId).data("searching");
					}
					let exportOptions = {
						columns: ':not(.hidden-print)',
						//rows: '.selected'
					};
					dataTable = $(dataTableId).dataTable({
						sAjaxSource: $(dataTableId).data("ajax-url"),
						buttons: [{
							extend: "print",
							exportOptions: exportOptions,
							className: "btn purple btn-outline",
							//autoPrint: false,
							customize: function(win) {
								var html = "";
								if($(dataTableId).data("title")) {
									html = "<h1>" + $(dataTableId).data("title") + "</h1><br/>";
								}
								var val = "";
								$("#" + $(dataTableId).data("filter-container") + " :input:visible").each(function(i, n) {
									val = $(n).hasClass("select2") ? $(n).find("option:selected").text() : $(n).val();
									if(val && val != "") {
										html += ($("label[for='" + $(n).attr('id') + "']").length > 0 ? $("label[for='" + $(n).attr('id') + "']").text() + " : " : "");
										if($(n).hasClass("select2")) {
											html += $(n).find("option:selected").text();
										} else {
											html += $(n).val();
										}
										html += "<br/>";
									}
								});
								if($(dataTableId).data("print-title")) {
									html = eval($(dataTableId).data("print-title"));
								}
								$(win.document.body).prepend(html != "" ? "<center>" + html + "</center>" : "");
								$(win.document.body).find('table')
								.addClass('compact')
								.css('font-size', 'inherit');
							},
						}, {
							extend: "pdf",
							exportOptions: exportOptions,
							className: "btn red btn-outline"
						}, {
							extend: "excel",
							exportOptions: exportOptions,
							className: "btn green btn-outline "
						}, {
							extend: "colvis",
							exportOptions: exportOptions,
							className: "btn dark btn-outline",
							text: "Extra"
						}],
						fixedHeader: {
							header: false,
							headerOffset: 70
						},
						sDom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-6'l><'col-md-6 col-sm-6'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
						bProcessing: true,
						bAutoWidth: false,
						bServerSide: true,
						bStateSave: false,
						sServerMethod: "POST",
						iDisplayLength: -1,
						aaSorting: sortedCols,
						aoColumns: cols,
						oTableTools: {
							sSwfPath: assetsPath + "jquery-datatables/swf/copy_csv_xls_pdf.swf"
						},
						bPaginate: bPaginate,
						sSearching: sSearching,
						sInfo: sInfo,
						aLengthMenu: aLengthMenu,
						language: {
							"url": assetsPath + "jquery-datatables/i18n/" + getCurrentLocale() + ".json"
							//processing: "<div class='overlay'><i class='fa fa-refresh fa-spin'></i></div>",
							//search: "<label for='filterField' class='sr-only'>Filter results</label>",
							//searchPlaceholder: "Filter groups",
							//	emptyTable: "No records found"
						},
						fnServerParams: function(aoData) {
							var filters = $(dataTableId).data("filter-container");
							if(filters) {
								$.each($("#" + $(dataTableId).data("filter-container") + " :input").serializeArray(), function() {
									aoData.push({
										"name": this.name,
										"value": this.value
									});
								});
							}
						},
						fnDrawCallback: function(oSettings) {
							// ActionButtons.init();
							if($(dataTableId).data("row-reorder")) {
								ReorderPrivateContents(dataTableId, $(dataTableId).data("row-reorder"));
							}
						},
						aoColumnDefs: aaColDefs,
						fnCreatedRow: function(row, data, dataIndex) {
							$(row).attr('id', data[0]);
						}
					});
				}
			}
		}, GetDatatableColumnsData(dataTableId));
		// });
	}
}

function GetDatatableColumnsData(dataTableId) {
	var data = {};
	data["type"] = "columns";
	var filters = $(dataTableId).data("filter-container");
	if(filters) {
		$.each($("#" + filters + " :input").serializeArray(), function() {
			data[this.name] = this.value;
		});
	}
	return data;
};

function initIntlPhoneMask(selector) {
	if(selector == undefined) selector = "";
	if($.fn.intlTelInput) {
		$(selector + " .intlPhoneMask").intlTelInput({
			// allowDropdown: false,
			autoHideDialCode: true,
			autoPlaceholder: true, // dropdownContainer: "body",
			// excludeCountries: ["us"],
			geoIpLookup: function(callback) {
				$.get("http://ipinfo.io", function() {
				}, "jsonp").always(function(resp) {
					var countryCode = (resp && resp.country) ? resp.country : "";
					callback(countryCode);
				});
			}, // hiddenInput: "full_number",
			// initialCountry: "auto",
			nationalMode: false, // //onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
			// placeholderNumberType: "MOBILE",
			preferredCountries: ['tr', 'gb', 'de'], // separateDialCode: true,
			utilsScript: assetsPath + "intl-tel-input/v12.1.7/js/utils.js",
			formatOnDisplay: true
		});
		$(selector + " .intlPhoneMask").on("keyup change", resetIntlTelInput);
		$(selector + " .intlPhoneMask").parents("form").find("input").on('blur', function() {
			var formValidation = $(this).parents("form").data("formValidation");
			if(formValidation) {
				formValidation.revalidateField('.intlPhoneMask');
			}
		});
	}
}

function resetIntlTelInput() {
	if(typeof intlTelInputUtils !== 'undefined') { // utils are lazy loaded, so must check
		var currentText = $(this).intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
		if(typeof currentText === 'string') { // sometimes the currentText is an object :)
			$(this).intlTelInput('setNumber', currentText); // will autoformat because of formatOnDisplay=true
		}
	}
}

function ReorderPrivateContents(dataTableId, method) {
	$(dataTableId).tableDnD({
		onDragClass: "myDragClass",
		onDrop: function(table, row) {
			var rows = table.tBodies[0].rows;
			var newOrder = [];
			for(var i = 0; i < rows.length; i++) {
				newOrder.push(rows[i].id);
			}
			var info = $(dataTableId).DataTable().page.info();
			window[method](newOrder.join(), info.page, info.recordsDisplay);
		},
		onDragStart: function(table, row) {
		}
	});
}

/*******************
 CHARTS
 ********************/
window.chartArray = [];
$(window).resize(function() {
	$.each(window.chartArray, function(i, o) {
		o.redraw();
	});
});

function barChart(selector) {
	var chart = $("#" + selector);
	var title = chart.attr("title");
	// chart.append("<span class='bold clearfix'>" + title + "</span>");
	var xkey = chart.data("xkey");
	var ykeys = chart.data("ykeys").split(',');
	var labels = chart.data("labels").split(',');
	var lineColors = chart.data("linecolors").split(',');
	var lineWidth = chart.data("linewidth");
	var resize = chart.data("resize");
	var redraw = chart.data("redraw");
	var stacked = chart.data("stacked");
	//alert(xkey + '\n' + ykeys + '\n' + labels + '\n' + lineColors + '\n' + lineWidth + '\n' + resize + '\n' + redraw);
	var data = [];
	getAjax(base_url("welcome/getchartdata"), function(o) {
		if(o.responseJSON) {
			var result = o.responseJSON;
			if(result.IsSuccessful) {
				data = result.Data;
				if(data.length > 0) {
					var graph = Morris.Bar({
						element: selector,
						data: data,
						stacked: stacked,
						xkey: xkey,
						ykeys: ykeys,
						labels: labels,
						lineColors: lineColors,
						lineWidth: lineWidth,
						resize: resize,
						redraw: redraw
					});
					window.chartArray.push(graph);
				}
			} else {
				alert(result.Message);
			}
		}
	}, {
		code: chart.data("code")
	});
}

function initSelects(container) {
	if($.fn.select2) {
		$.fn.select2.defaults.set("theme", "bootstrap");
		if(container == undefined) container = "body";
		initSelect2Initials(container);
		$(container).find("select.select2:not([data-ajax-url])").each(function() {
			let placeholder = $(this).data("placeholder") ? $(this).data("placeholder") : "";
			$(this).select2({
				width: null,
				placeholder: placeholder,
				allowClear: true
			});
		});
		$(container).find("select.select2[data-ajax-url]").each(function() {
			let placeholder = $(this).data("placeholder") ? $(this).data("placeholder") : "";
			let tags = !!$(this).data("tags");
			$(this).select2({
				tags: tags,
				width: null,
				placeholder: placeholder,
				allowClear: true,
				escapeMarkup: function(markup) {
					return markup;
				}, // let our custom formatter work
				ajax: {
					type: "POST",
					dataType: "json",
					delay: 250,
					data: function(params) {
						if($(this).data("ajax-data")) {
							var data = eval($(this).data('ajax-data'));
							data.searchterm = params.term;
							data.definition = ($(this).data("definition") ? $(this).data("definition") : null);
							data.parent = ($(this).data("parent") ? $("#" + $(this).data("parent")).val() : null);
							return data;
						} else {
							return {
								searchterm: params.term, // search term
								definition: ($(this).data("definition") ? $(this).data("definition") : null),
								parent: ($(this).data("parent") ? $("#" + $(this).data("parent")).val() : null)
							};
						}
					},
					processResults: function(results, params) {
						params.page = params.page || 1;
						var data = $.map(results, function(obj) {
							obj.id = "" + obj.id;
							if(!obj.text) {
								if(obj.name) {
									obj.text = obj.name;
								} else if(obj.title) {
									obj.text = obj.title;
								}
							}
							return obj;
						});
						return {
							results: data,
							pagination: {
								more: (params.page * 30) < results.total_count
							}
						};
					},
					cache: false,
					initSelection: function(element, callback) {
					}
				}
			});
		});
	}
	$(container).find("select.selectdynamic[data-ajax-url]").each(function() {
		var select = $(this);
		var sel = select.data("selected");
		getAjax($(this).data('ajax-url'), function(result) {
			if(result) {
				var data = result.responseJSON;
				$.each(data, function(i, o) {
					$(select).append($("<option value='" + o.id + "'" + (sel == o.id ? "selected" : "") + ">" + o.name + "</option>"))
				});
			}
		}, null);
	});
}

function initICheck(container) {
	if($.fn.iCheck) {
		// Checkbox & Radios
		if(container == undefined) container = "body";
		$(container).find('input.icheck').each((i, o) => {
			$(o).iCheck({
				checkboxClass: ($(o).data("class") ? $(o).data("class") : icheck_checbox_class),
				radioClass: ($(o).data("class") ? $(o).data("class") : icheck_radio_class),
				increaseArea: ($(o).data("area") ? $(o).data("area") : icheck_area) // optional
			});
		});
	}
}

function initTagsInput(container) {
	if($.fn.tagsinput) {
		if(container == undefined) container = "body";
		$(container).find('input.tags').each((i, o) => {
			$(o).tagsinput({
				trimValue: true,
				// tagClass: function(item) {
				// 	return (item.length > 10 ? 'big' : 'small');
				// },
				onTagExists: function(item, $tag) {
					$tag.hide().fadeIn();
				}
			});
		});
	}
}

function initAutoNumeric(container) {
	if($.fn.autoNumeric) {
		if(container == undefined) container = "body";
		$(container).find('.autoNumeric').each((i, o) => {
			$(o)
			.autoNumeric('init', {
				aSep: $(o).data("a-sep") ? $(o).data("a-sep") : "",
				aDec: $(o).data("a-dec") ? $(o).data("a-dec") : ".",
				mDec: $(o).data("m-dec") ? $(o).data("m-dec") : "2",
				vMin: $(o).data("v-min") ? $(o).data("v-min") : "0"
			})
			.on("focus", function() {
				$(this).select();
			})
		});
	}
}

function initBootstrapSwitch(container) {
	if($.fn.bootstrapSwitch) {
		if(container == undefined) container = "body";
		$(container).find('.switch').each((i, o) => {
			$(o).bootstrapSwitch();
		});
	}
}

function initSelect2Initials(container) {
	if(container == undefined) container = "body";
	$(container).find(".select2[data-ajax-url][data-init-value!='']").each(function(i, slct) {
		var data = {};
		if($(this).data("ajax-data")) {
			data = eval($(this).data('ajax-data'));
		}
		data.id = $(this).data('init-value');
		data.definition = $(this).data('definition');
		if(data.id) {
			getAjax($(this).data('ajax-url'), function(result) {
				if(result) {
					var data = result.responseJSON;
					$(this).removeAttr("data-init-value");
					$.each(data, function(i, o) {
						$(slct).append("<option value='" + o.id + "'>" + o.name + "</option>");
					});
				}
			}, data);
		}
	});
}

function convertDate(dateStr) {
	var a = dateStr.split(" ");
	var d = a[0].split("/");
	var t = ["00", "00", "00"];
	if(a.length == 2) {
		t = a[1].split(":");
		if(t.length == 2) {
			t.push("00");
		}
	}
	var date = new Date(d[2], (d[1] - 1), d[0], t[0], t[1], t[2]);
	return date;
}

function convertDate2(dateStr) {
	var a = dateStr.split(" ");
	var d = a[0].split("-");
	var t = a[1].split(":");
	if(t.length == 2) {
		t.push("00");
	}
	var date = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
	return date;
}

function JoinPoll() {
	var inp = $("#currentpoll input[name='idchoice']:checked");
	var idpoll = inp.data("idpoll");
	var idchoice = inp.val();
	getAjax(base_url("joinpoll"), function(result) {
		if(result.responseJSON) {
			var data = result.responseJSON;
			if(data.IsSuccessful) {
				//$.cookie("poll_" + idpoll, 1, 10000); //server da atılıyor.
				ShowPoll();
			} else {
				alert(data.Message);
			}
		}
	}, {
		idpoll: idpoll,
		idchoice: idchoice
	});
}

function ShowPoll() {
	if($("#poll_container").length > 0) {
		getAjax(base_url("getcurrentpoll"), function(result) {
			if(result.responseJSON) {
				var data = result.responseJSON;
				if(data.IsSuccessful) {
					var poll = data.Data;
					if(poll) {
						var ck = $.cookie("poll_" + poll.idpoll);
						var template = (!ck || ck == "" ? "poll_form" : "poll_view");
						if(poll.idpoll) {
							$("#poll_container").html(tmpl(template, poll));
						}
					}
				} else {
					alert(data.Message);
				}
			}
		});
	}
}

function GetCurrencyStatus() {
	if($("#currency_container").length > 0) {
		if(currencyStatusTimeout) clearTimeout(currencyStatusTimeout);
		currencyStatusTimeout = setTimeout("UpdateCurrencyStatus()", 120000);
	}
}

function UpdateCurrencyStatus() {
	if($("#currency_container").length > 0) {
		getAjax(base_url("getcurrencystatus"), function(result) {
			if(result.responseJSON) {
				var data = result.responseJSON;
				if(data.IsSuccessful) {
					var currencies = data.Data;
					$.each(currencies, function(i, o) {
						var curBox = $("#currency_container ." + o.code);
						if(curBox.length > 0) {
							$(curBox).find(".price").html(o.price);
							$(curBox).find(".change_rate").html("(%" + (o.change_rate > 0 ? "+" : "") + o.change_rate.toString() + ")");
							$(curBox).find(".price,.arrow,.change_rate").removeClass("up").removeClass("down").removeClass("notr").addClass(o.change_rate > 0 ? "up" : (o.change_rate < 0 ? "down" : "notr"));
						}
					});
					GetCurrencyStatus();
				} else {
					console.log(data.Message);
				}
			}
		});
	}
}

function correctCaptcha(response) {
	$("#recaptcha_verification").val(response);
}

function printContent(selector) {
	var newWin = window.open('', 'Print-Window');
	newWin.document.open();
	newWin.document.write('<html><body onload="window.print()">' + $(selector)[0].outerHTML + '</body></html>');
	newWin.document.close();
	setTimeout(function() {
		newWin.close();
	}, 10);
}

function CreateImageColumn(nTd, sData, oData, iRow, iCol) {
	var image = "";
	if(sData != null) {
		image = '<img height="50" src="' + get_img_url(sData, 'w50h50') + '" />';
	} else {
		image = '<img height="50" src="' + uriToPlaceHoldIt + '50x50/EFEFEF/AAAAAA&text=resim+yok" />';
	}
	$(nTd).html(image);
}

function CreateFlagColumn(nTd, sData, oData, iRow, iCol) {
	var image = "";
	if(sData != null) {
		image = '<img src="' + assetsPath + '/images/flags/' + sData + '.png"/>';
	} else {
		image = '<img height="10" src="' + uriToPlaceHoldIt + '50x50/EFEFEF/AAAAAA&text=resim+yok" />';
	}
	$(nTd).html(image);
}

function CreateStatusColumn(nTd, sData, oData, iRow, iCol) {
	$(nTd).html("<p data-toggle='tooltip' data-placement='left' " + " class='" + (sData == "1" ? "btn green btn-xs" : "btn red btn-xs") + "'" + " title='" + (sData == "1" ? "Aktif" : "Pasif") + "'" + "><i class='" + (sData == "1" ? "fa fa-check" : "fa fa-remove") + "'></i></p>");
}

function CreateDateTimeColumn(nTd, sData, oData, iRow, iCol) {
	let vals = sData.split(" ");
	let dt = new Date(vals[0]);
	$(nTd).html(dt.getUTCDate().toString().padStart(2, "0") + "/" + (dt.getUTCMonth() + 1).toString().padStart(2, "0") + "/" + dt.getUTCFullYear().toString() + "<span class='clearfix'>" + vals[1] + "</span>");
}

function CreateDateColumn(nTd, sData, oData, iRow, iCol) {
	if(sData) {
		let vals = sData.split(" ");
		let dt = new Date(vals[0]);
		$(nTd).html(dt.getUTCDate().toString().padStart(2, "0") + "/" + (dt.getUTCMonth() + 1).toString().padStart(2, "0") + "/" + dt.getUTCFullYear().toString());
	}
}

function CreateTimeColumn(nTd, sData, oData, iRow, iCol) {
	let vals = sData.split(" ");
	let val = vals.length == 2 ? vals[1] : vals[0];
	$(nTd).html("<span class='clearfix'>" + val + "</span>");
}

function CreateYesNoColumn(nTd, sData, oData, iRow, iCol) {
	$(nTd).html("<p data-toggle='tooltip' data-placement='left' " + " class='" + (sData == "1" ? "btn green btn-xs" : "btn red btn-xs") + "'" + " title='" + (sData == "1" ? "Evet" : "Hayır") + "'" + "><i class='" + (sData == "1" ? "fa fa-check" : "fa fa-remove") + "'></i></p>");
}

function CreateGenderColumn(nTd, sData, oData, iRow, iCol) {
	var buttonClass = "";
	var title = "";
	var iconClass = "";
	if(sData == "m") {
		buttonClass = "btn blue btn-xs";
		iconClass = "icon-user";
		title = "Erkek";
	} else if(sData == "f") {
		buttonClass = "btn red-pink btn-xs";
		iconClass = "icon-user-female";
		title = "Kadın";
	} else {
		buttonClass = "btn dark btn-xs";
		iconClass = "icon-question";
		title = "Seçilmemiş";
	}
	$(nTd).html("<p data-toggle='tooltip' data-placement='left' " + " class='" + buttonClass + "'" + "><i class='" + iconClass + "'></i>" + title + "</p>");
}

function CreateIconColumn(nTd, sData, oData, iRow, iCol) {
	$(nTd).html("<i class='" + sData + "'></i>");
}

function CreateRecordStatusColumn(nTd, sData, oData, iRow, iCol) {
	var buttonClass = "";
	var iconClass = "";
	if(sData == "1") {
		buttonClass = "btn yellow btn-xs";
		iconClass = "fa fa-hourglass-1";
	} else if(sData == "2") {
		buttonClass = "btn green btn-xs";
		iconClass = "fa fa-check";
	} else if(sData == "3") {
		buttonClass = "btn red-pink btn-xs";
		iconClass = "fa fa-ban";
	} else if(sData == "4") {
		buttonClass = "btn red btn-xs";
		iconClass = "icon-trash";
	} else {
		buttonClass = "btn dark btn-xs";
		iconClass = "icon-question";
		title = "Seçilmemiş";
	}
	$(nTd).html("<p data-toggle='tooltip' data-placement='left' " + " class='" + buttonClass + "'" + "><i class='" + iconClass + "'></i></p>");
}

function InjectScript(scriptPaths, onload) {
	var script;
	if(!Array.isArray(scriptPaths)) {
		scriptPaths = [scriptPaths];
	}
	for(i = 0; i < scriptPaths.length; i++) {
		script = document.createElement('script');
		if(i === scriptPaths.length - 1) {
			if(onload)
				script.onload = onload;
		}
		document.head.appendChild(script);
		script.src = scriptPaths[i];
	}
}

function InjectCss(linkPaths, onload) {
	var link;
	if(!Array.isArray(linkPaths)) {
		linkPaths = [linkPaths];
	}
	for(i = 0; i < linkPaths.length; i++) {
		link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = linkPaths[i];
		if(i === linkPaths.length - 1) {
			if(onload)
				link.onload = onload;
		}
		document.head.appendChild(link);
	}
}

function TrimText(nTd, sData, oData, iRow, iCol) {
	if(sData != null) {
		$(nTd).html(sData.length > 50 ? ("<span title='" + sData + "'>" + sData.substr(0, 50) + "..</span>") : sData);
	}
}

function getLocation() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(savePosition, positionError, {timeout: 10000});
	} else {
		//Geolocation is not supported by this browser
	}
}

// handle the error here
function positionError(error) {
	var errorCode = error.code;
	var message = error.message;
	alert(message);
}

function savePosition(position) {
	$.post("/geocoordinates", {
		lat: position.coords.latitude,
		lng: position.coords.longitude
	});
}

function PopupCenter(url, windowname, w, h) {
	var top = window.outerHeight / 2 + window.screenY - (h / 2)
	var left = window.outerWidth / 2 + window.screenX - (w / 2)
	var newWindow = window.open(url, windowname, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
	// Puts focus on the newWindow
	if(window.focus) newWindow.focus();
}

function ShowProcessingModal() {
	progressTimeout = setTimeout(function() {
		$('#processingModal').modal({
			backdrop: 'static',
			keyboard: false,
			show: true
		});
	}, 500);
}

function HideProcessingModal() {
	clearTimeout(progressTimeout);
	$('#processingModal').modal('hide');
}

function createRandomPassword(length = 8, input = 'alpha-numeric') {
	var alphabet = 'abcdefghijklmnopqrstuvwxyz';
	var password = '';
	if(input == 'alpha') {
		alphabet = 'abcdefghijklmnopqrstuvwxyz';
	} else if(input == 'alpha-caps') {
		alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	} else if(input == 'alpha-numeric') {
		alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
	} else if(input == 'alpha-numeric-caps') {
		alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	} else if(input == 'alpha-numeric-symbols') {
		alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_+-=';
	} else if(input == 'alpha-numeric-caps-symbols') {
		alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*()_+-=';
	}
	var alphabet_length = alphabet.length - 1;
	for(var i = 0; i < length; i++) {
		var random_number = Math.floor(Math.random() * alphabet_length) + 1;
		password += alphabet[random_number];
	}
	return password;
}