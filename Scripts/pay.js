
var pricing = {
    "Membership": Object({
        Regular: 20,
        Trial: 10
    })
};

function addToRow(row, el) {
    var td = document.createElement("td");
    td.appendChild(el);
    row.appendChild(td);
    return td;
}
function elementWithText(type, text) {
    el = document.createElement(type);
    el.appendChild(document.createTextNode(text));
    return (el);
}
function newInput(row, type, name) {
    var el = document.createElement(type == "select" ?
                                     "select" : "input");
    if (el != "select") {
        el.setAttribute("type", type);
    } else {
        el.setAttribute("size", 1);
    }
    el.setAttribute("id", name);
    el.setAttribute("name", name);
    if (row != undefined) addToRow(row, el);
    return el;
}

function create_new_row() {
    var list = $("#itemlist")[0];
    var rownum = list.rows.length;
    var row = list.insertRow(rownum++);
    row.setAttribute("id", "row_" + rownum);
    var el;

    el = newInput(row, "text", "product_sku_" + rownum);
    el.setAttribute("length", "40");
    el.setAttribute("title", "Email address of who this item is for.");
	el.setAttribute("class", "form-control");
    if (rownum > 1) {
        el.value = $("product_sku_" + (rownum - 1)).value;
    }

    el = newInput(row, "text", "product_description_" + rownum);
    el.setAttribute("length", "40");
    el.setAttribute("title", "Scene name of who this item is for.");
	el.setAttribute("class", "form-control");
    if (rownum > 1) {
        el.value = $("product_description_" + (rownum - 1)).value;
    }
    el = newInput(row, "select", "product_option_1_" + rownum);
    for (var i in pricing) {
        el.appendChild(elementWithText("option", i));
    }
	el.setAttribute("class", "form-control");
    el = newInput(row, "select", "product_option_2_" + rownum);
    el.setAttribute("onchange", "update_totals ()");
	el.setAttribute("class", "form-control");
    el = newInput(row, "hidden", "product_amount_" + rownum);

    var span = document.createElement("span");
    span.setAttribute("id", "visible_amount_" + rownum);
    span.setAttribute("class", "price");
    el.parentNode.setAttribute("class", "price");
    el.parentNode.appendChild(span);

    el = elementWithText("a", "✕");
    el.setAttribute("id", "cancel_" + rownum);
    el.setAttribute("class", "cancel");
    addToRow(row, el);

    wire_up(rownum);
    update_suboptions(rownum);
}

function wire_up(row) {
    $("#product_option_1_" + row)[0].setAttribute("onchange",
                     "update_suboptions (" + row + ")");
    // $("#cancel_" + row).setAttribute("href",
                     // "javascript:delete_row(" + row + ")");
	$("#cancel_" + row).click(function(){ delete_row(row); });
}

function update_suboptions(rownum) {
    var primary = $("#product_option_1_" + rownum)[0];
    var second = $("#product_option_2_" + rownum)[0];
    var options = pricing[primary.value];
    while (second.length > 0) {
        second.remove(0);
    }
    for (var i in options) {
        second.appendChild(elementWithText("option", i));
    }
    update_totals();
}
function get_price(rownum) {
    var primary = $("#product_option_1_" + rownum)[0];
    var second = $("#product_option_2_" + rownum)[0];
    var price = $("#product_amount_" + rownum)[0];
    var visprice = $("#visible_amount_" + rownum)[0];
    var value = pricing[primary.value][second.value];
    price.value = value.toFixed(2);
    visprice.innerHTML = value.toFixed(2);
    return value;
}

function renumber_id(id, from, to) {
    $("#" + id + from)[0].setAttribute("id", id + to);
    $("#" + id + to)[0].setAttribute("name", id + to);
}

function delete_row(row) {
    var rows = $("#itemlist")[0].rows.length;
    if (rows == 1) {
        alert("You must purchase at least one item.");
    } else {
        $("#itemlist")[0].deleteRow(row - 1);
        for (var i = row; i < rows; i++) {
            renumber_id("product_sku_", i + 1, i);
            renumber_id("product_description_", i + 1, i);
            renumber_id("product_option_1_", i + 1, i);
            renumber_id("product_option_2_", i + 1, i);
            renumber_id("product_amount_", i + 1, i);
            renumber_id("visible_amount_", i + 1, i);
            renumber_id("cancel_", i + 1, i);
            wire_up(i);
        }
    }
    update_totals();
}

function update_totals() {
    var total = 0.00;
    for (var i = 1; i <= $("#itemlist")[0].rows.length; i++) {
        total += parseFloat(get_price(i));
    }
    $("#total")[0].innerHTML = '$' + parseFloat(total).toFixed(2);
}

function form_is_complete() {
    var complete = true;
    for (var i = 1; i <= $("#itemlist")[0].rows.length; i++) {
        var email = $("#product_sku_" + i)[0];
        if (/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/.test(email.value)) {
            email.setAttribute("class", "");
        } else {
            email.setAttribute("class", "invalid");
            if (complete) {
                email.focus();
            }
            complete = false;
        }
        var name = $("#product_description_" + i)[0];
        if (/[A-Za-z0-9 ]+/.test(name.value)) {
            name.setAttribute("class", "");
        } else {
            name.setAttribute("class", "invalid");
            if (complete) {
                name.focus();
            }
            complete = false;
        }
    }
    return complete;
}


//create_new_row();
//delete_row(1);

$("#JavaScriptPresent")[0].style.display = "block";
$("#NoJavaScript")[0].style.display = "none";
