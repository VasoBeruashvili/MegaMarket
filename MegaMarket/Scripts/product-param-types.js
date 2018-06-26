var productParamType = {
    id: 0,
    name: '',
    type: 0,
    deleted: false
}

var types = [
    'მოსანიშნი',
    'სია'
];

var selectedTypeIndex = 0;

function AddProductParamType() {
    $('#addEditProductParamTypeTitle').text('პარამეტრის დამატება');
    $('#productParamTypeName').val('');
    $('#addEditProductParamType').show();
    $('#productParamTypeName').focus();

    productParamType.id = 0;
    SelectType(0);
}

function EditProductParamType(productParamTypeId, productParamTypeName, productParamTypeType) {
    $('#addEditProductParamTypeTitle').text('პარამეტრის რედაქტირება');
    $('#productParamTypeName').val(productParamTypeName);
    $('#productParamTypeName').focus();
    $('#addEditProductParamType').show();

    productParamType.id = productParamTypeId;
    SelectType(productParamTypeType);
}

function CancelSaveProductParamType() {
    $('#addEditProductParamType').hide();

    productParamType.id = 0;
    productParamType.name = '';
}

function DeleteProductParamType(productParamTypeId) {
    productParamType.id = productParamTypeId;
    productParamType.deleted = true;

    SaveProductParamType(true);
}


function SaveProductParamType(deleted) {
    if (!IsUndefinedNullOrEmpty($('#productParamTypeName').val()) || deleted) {
        productParamType.name = $('#productParamTypeName').val();
        productParamType.type = selectedTypeIndex;

        $.ajax({
            type: "POST",
            url: "/MegaMarket/Admin/Office/SaveProductParamType",
            data: productParamType,
            success: function (data) {
                if (data) {
                    window.location.reload();
                }
            }
        });
    } else {
        $('#productParamTypeName').css('border-color', '#FF0000');
        $('#productParamTypeType').css('border-color', '#FF0000');
    }
}

function SelectType(typeIndex) {
    $('#selectedTypeName').text(types[typeIndex]);
    selectedTypeIndex = types.indexOf($('#selectedTypeName').text());
}