var manufacturer = {
    id: 0,
    name: '',
    deleted: false
}

function AddManufacturer() {
    $('#addEditManufacturerTitle').text('მწარმოებლის დამატება');
    $('#manufacturerName').val('');
    $('#addEditManufacturer').show();
    $('#manufacturerName').focus();

    manufacturer.id = 0;
}

function EditManufacturer(manufacturerId, manufacturerName) {
    $('#addEditManufacturerTitle').text('მწარმოებლის რედაქტირება');
    $('#manufacturerName').val(manufacturerName);
    $('#manufacturerName').focus();
    $('#addEditManufacturer').show();

    manufacturer.id = manufacturerId;
}

function CancelSaveManufacturer() {
    $('#addEditManufacturer').hide();

    manufacturer.id = 0;
    manufacturer.name = '';
}

function DeleteManufacturer(manufacturerId) {
    manufacturer.id = manufacturerId;
    manufacturer.deleted = true;

    SaveManufacturer(true);
}


function SaveManufacturer(deleted) {
    if (!IsUndefinedNullOrEmpty($('#manufacturerName').val()) || deleted) {
        manufacturer.name = $('#manufacturerName').val();

        $.ajax({
            type: "POST",
            url: "/MegaMarket/Admin/Office/SaveManufacturer",
            data: manufacturer,
            success: function (data) {
                if (data) {
                    window.location.reload();
                }
            }
        });
    }else{
        $('#manufacturerName').css('border-color', '#FF0000');
    }    
}