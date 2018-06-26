var vendor = {
    id: 0,
    name: '',
    code: '',
    deleted: false
}

function AddVendor() {
    $('#addEditVendorTitle').text('მომწოდებლის დამატება');
    $('#vendorName').val('');
    $('#vendorCode').val('');
    $('#addEditVendor').show();
    $('#vendorName').focus();

    vendor.id = 0;
}

function EditVendor(vendorId, vendorName, vendorCode) {
    $('#addEditVendorTitle').text('მომწოდებლის რედაქტირება');
    $('#vendorName').val(vendorName);
    $('#vendorCode').val(vendorCode);
    $('#vendorName').focus();
    $('#addEditVendor').show();

    vendor.id = vendorId;
}

function CancelSaveVendor() {
    $('#addEditVendor').hide();

    vendor.id = 0;
    vendor.name = '';
    vendor.code = '';
}

function DeleteVendor(vendorId) {
    vendor.id = vendorId;
    vendor.deleted = true;

    SaveVendor(true);
}


function SaveVendor(deleted) {
    if (!IsUndefinedNullOrEmpty($('#vendorName').val()) && !IsUndefinedNullOrEmpty($('#vendorCode')) || deleted) {
        vendor.name = $('#vendorName').val();
        vendor.code = $('#vendorCode').val();

        $.ajax({
            type: "POST",
            url: "/MegaMarket/Admin/Office/SaveVendor",
            data: vendor,
            success: function (data) {
                if (data) {
                    window.location.reload();
                }
            }
        });
    } else {
        $('#vendorName').css('border-color', '#FF0000');
        $('#vendorCode').css('border-color', '#FF0000');
    }
}