var TooltipFormatExtension = (function() {
    var Model = DevExpress.Dashboard.Model;

    // 1. Model
    var autoTooltipFormatProperty = {
        ownerType: Model.ChartItem,
        propertyName: 'TooltipFormat',
        defaultValue: false,
        valueType: 'string'
    };
    var autoTooltipColourProperty = {
        ownerType: Model.ChartItem,
        propertyName: 'TooltipColour',
        defaultValue: false,
        valueType: 'string'
    };

    Model.registerCustomProperty(autoTooltipFormatProperty);
    Model.registerCustomProperty(autoTooltipColourProperty);

    // 2. Viewer
    function onItemWidgetOptionsPrepared(args) {
        var TooltipFormat = args.dashboardItem.customProperties.getValue(autoTooltipFormatProperty.propertyName);
        var TooltipColour = args.dashboardItem.customProperties.getValue(autoTooltipColourProperty.propertyName);
        if (TooltipFormat) {
            var old = args.options.tooltip.format;
            // args.options.tooltip.format = TooltipFormat;
            args.options.tooltip.customizeTooltip = function(data) {
                window.x = data;
                // console.log(data.point.series.tag.valueFormats[0]);
                let f = DevExpress.localization.formatNumber;
                try {
                    let val = eval('(`' + TooltipFormat + '`)');
                    let col = eval('(`' + TooltipColour + '`)');
                    let colparts = col.split(/[ ,|]/);
                    console.log('colparts', colparts, { text: val, color: colparts[0] || null, fontColor: colparts[1] || null });
                    return { text: val, color: colparts[0] || null, fontColor: colparts[1] || null };
                } catch (e) {
                    return { text: e.message }
                }
            };
            //var valueAxisOptions = args.options["valueAxis"];
            //if (valueAxisOptions && valueAxisOptions[0]) {
            //    valueAxisOptions[0].autoBreaksEnabled = true;
            //}
        }
    }

    // 3. Designer
    function onCustomizeSections(args) {
        args.addSection({
            title: "Tooltip",
            items: [
                {
                    dataField: autoTooltipFormatProperty.propertyName,
                    editorType: "dxTextArea",
                    label: {
                        text: "Format Expression"
                    },
                    editorOptions: {
                        height: 90,
                    }
                },
                {
                    dataField: autoTooltipColourProperty.propertyName,
                    editorType: "dxTextArea",
                    label: {
                        text: "Colour Expression"
                    },
                    editorOptions: {
                        height: 90
                    }
                }
            ]
        });
    };
    // 4. Event Subscription
    function TooltipFormatExtension(dashboardControl) {
        this.name = "TooltipFormat",
            this.start = function () {
                var viewerApiExtension = dashboardControl.findExtension('viewer-api');
                if (viewerApiExtension) {
                    viewerApiExtension.on('itemWidgetOptionsPrepared', onItemWidgetOptionsPrepared);
                }
                var optionsPanelExtension = dashboardControl.findExtension("item-options-panel");
                if (optionsPanelExtension) {
                    optionsPanelExtension.on('customizeSections', onCustomizeSections);
                }
            },
            this.stop = function () {
                var viewerApiExtension = dashboardControl.findExtension('viewer-api');
                if (viewerApiExtension) {
                    viewerApiExtension.off('itemWidgetOptionsPrepared', onItemWidgetOptionsPrepared);
                }
                var optionsPanelExtension = dashboardControl.findExtension("item-options-panel");
                if (optionsPanelExtension) {
                    optionsPanelExtension.off('customizeSections', onCustomizeSections);
                }
            }
    }
    return TooltipFormatExtension;
}());
