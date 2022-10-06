/**
 * @typedef {import('devexpress-dashboard/model').GridItem} GridItem
 * @typedef {import('devexpress-dashboard/model').ChartItem} ChartItem
 */

function splitStack(items) {
    const sortedItems = [];

    console.log('splitStack', items)

    let toggle = false;
    items.forEach((item) => {
        item.stack = toggle ? 'A' : 'B';
        toggle = !toggle;
    });
    return sortedItems;
}


function customizeWidgetOptions(e) {
    const type = e.dashboardItem.componentName().substring(0, 5);
    console.log('chart', e);
    console.log('type', type);
    console.log('itemType', e.dashboardItem.itemType);

    if (e.dashboardItem instanceof DevExpress.Dashboard.Model.GridItem) {
        e.options.hoverStateEnabled = true;
    }
    if (e.dashboardItem instanceof DevExpress.Dashboard.Model.ChartItem) {
        var series = e.options.series;
        $(series).each(function (i, item) {
            if (item.label)
                item.label.font = { size: 12 + 'px', family: 'Arial' };
        });

        e.options.tooltip = {
            enabled: true,
            customizeTooltip(data) {
                window.x = data;
                console.log(data.point.series.tag.valueFormats[0]);
                return {
                    // text: `${data.seriesName}: ${DevExpress.localization.formatNumber(data.value, '#,##0.00')}`,
                    text: `${data.seriesName}: ${data.valueText}`
                };
            }
        };

        // splitStack(e.options.series);
        console.log(e.options.series);
        e.options.animation = {
            enabled: true,
            duration: 500
        };
    }

if (e.dashboardItem instanceof DevExpress.Dashboard.Model.PieItem) {
    e.options.legend = {
        visible: true,
        border: {
            visible: true
        }
    };
    e.options.animation = {
        enabled: true,
        duration: 1000
    };
}
return e;
}

function onBeforeRender(dashboardControl) {
    dashboardControl.registerExtension(new DevExpress.Dashboard.DashboardPanelExtension(dashboardControl));
    dashboardControl.registerExtension(new SimpleTableCustomItem(dashboardControl));
    dashboardControl.registerExtension(new PolarChartCustomItem(dashboardControl));
    dashboardControl.registerExtension(new ParameterCustomItem(dashboardControl));
    dashboardControl.registerExtension(new OnlineMapCustomItem(dashboardControl));
    dashboardControl.registerExtension(new WebPageCustomItem(dashboardControl));
    dashboardControl.registerExtension(new GanttCustomItem(dashboardControl));
    dashboardControl.registerExtension(new TreeViewCustomItem(dashboardControl));
    dashboardControl.registerExtension(new FunnelD3CustomItem(dashboardControl));

    const viewerApiExtension = dashboardControl.findExtension('viewer-api');
    if (viewerApiExtension)
        viewerApiExtension.on('itemWidgetOptionsPrepared', customizeWidgetOptions);
}

window.InsightFunctions = {
    onBeforeRender: onBeforeRender,
    customizeWidgetOptions: customizeWidgetOptions
}
