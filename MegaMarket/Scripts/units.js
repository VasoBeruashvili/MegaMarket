var unit = {
    id: 0,
    shortName: '',
    fullName: '',
    deleted: false
}

function AddUnit() {
    $('#addEditUnitTitle').text('ერთეულის დამატება');
    $('#unitShortName').val('');
    $('#unitFullName').val('');
    $('#addEditUnit').show();
    $('#unitShortName').focus();

    unit.id = 0;
}

function EditUnit(unitId, unitShortName, unitFullName) {
    $('#addEditUnitTitle').text('ერთეულის რედაქტირება');
    $('#unitShortName').val(unitShortName);
    $('#unitFullName').val(unitFullName);
    $('#unitShortName').focus();
    $('#addEditUnit').show();

    unit.id = unitId;
}

function CancelSaveUnit() {
    $('#addEditUnit').hide();

    unit.id = 0;
    unit.shortName = '';
    unit.fullName = '';
}

function DeleteUnit(unitId) {
    unit.id = unitId;
    unit.deleted = true;

    SaveUnit(true);
}


function SaveUnit(deleted) {
    if (!IsUndefinedNullOrEmpty($('#unitShortName').val()) && !IsUndefinedNullOrEmpty($('#unitFullName').val()) || deleted) {
        unit.shortName = $('#unitShortName').val();
        unit.fullName = $('#unitFullName').val();

        $.ajax({
            type: "POST",
            url: "/MegaMarket/Admin/Office/SaveUnit",
            data: unit,
            success: function (data) {
                if (data) {
                    window.location.reload();
                }
            }
        });
    } else {
        $('#unitShortName').css('border-color', '#FF0000');
        $('#unitFullName').css('border-color', '#FF0000');
    }
}