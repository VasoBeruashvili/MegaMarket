var priceType = {
    id: 0,
    name: '',
    deleted: false
}

function AddPriceType() {
    $('#addEditPriceTypeTitle').text('ფასის სახეობის დამატება');
    $('#priceTypeName').val('');
    $('#addEditPriceType').show();
    $('#priceTypeName').focus();

    priceType.id = 0;
}

function EditPriceType(priceTypeId, priceTypeName) {
    $('#addEditPriceTypeTitle').text('ფასის სახეობის რედაქტირება');
    $('#priceTypeName').val(priceTypeName);
    $('#priceTypeName').focus();
    $('#addEditPriceType').show();

    priceType.id = priceTypeId;    
}

function CancelSavePriceType() {
    $('#addEditPriceType').hide();

    priceType.id = 0;
    priceType.name = '';
}

function DeletePriceType(priceTypeId) {
    priceType.id = priceTypeId;
    priceType.deleted = true;

    SavePriceType(true);
}


function SavePriceType(deleted) {    
    if(!IsUndefinedNullOrEmpty($('#priceTypeName').val()) || deleted){
        priceType.name = $('#priceTypeName').val();

        $.ajax({
            type: "POST",
            url: "/MegaMarket/Admin/Office/SavePriceType",
            data: priceType,
            success: function (data) {
                if (data) {
                    window.location.reload();
                }
            }
        });
    }else{
        $('#priceTypeName').css('border-color', '#FF0000');
    }    
}