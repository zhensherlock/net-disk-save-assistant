import { sleep } from '@/utils'

export const execute = async (data) => {
  const $table = $('#voucher tbody')
  const $combo = $('#COMBO_WRAP')
  const abstractFieldName = '交易日期'
  const subjectFieldName = '一级科目'
  const customerFieldName = '二级科目'
  const moneyFieldName = '交易金额'
  const time = 200
  for (const item of data) {
    const index = data.indexOf(item)
    // 添加行操作 Begin
    {
      const $col = $table.find(`.col_operate:eq(${index})`)
      $col.find('.add').click()
      await sleep(time)
    }
    // 添加行操作 End

    // 设置摘要 Begin
    {
      const $summaryCol = $table.find(`.col_summary:eq(${index})`)
      $summaryCol.click()
      await sleep(time)
      $summaryCol.find('input').val(item[abstractFieldName]).change().keyup().focus()
      await sleep(time)
    }
    // 设置摘要 End

    // 设置会计科目 Begin
    {
      const $subjectCol = $table.find(`.col_subject:eq(${index})`)
      $subjectCol.click()
      await sleep(time)
      $subjectCol.find('input').val(item[subjectFieldName]).focus().keyup().change()
      await sleep(time)
      const $subjectList = $combo.find('.ui-droplist-wrap:visible')
      $subjectList.find(`.list-item:contains('${item[subjectFieldName]}')`).click()
      await sleep(time)
    }
    // 设置会计科目 End

    // 设置客户 Start
    let lastCustomerId = null
    {
      // 获取最后一个客户的编号
      $('#isItem li:visible .trigger').click()
      await sleep(time)
      const $customerListWrap = $combo.find('.ui-droplist-wrap:visible')
      const $lastCustomer = $customerListWrap.find('.list-item').last()
      if ($lastCustomer.length > 0) {
        lastCustomerId = $lastCustomer.text().split(' ')[0]
      }
    }
    {
      $('#isItem input:visible').val(item[customerFieldName]).focus().change().keyup()
      await sleep(time)
      const $customerListWrap = $combo.find('.ui-droplist-wrap:visible')
      const $customerList = $customerListWrap.find(`.list-item:contains('${item[customerFieldName]}')`)
      if ($customerList.length > 0) {
        $customerList.eq(0).click()
      } else {
        $customerListWrap.find('#quickAddInstantItem1').click()
        await sleep(time)
        $('#assistingNumber').val(parseInt(lastCustomerId) + 1)
        await sleep(time)
        $('#assistingName').val(item[customerFieldName])
        await sleep(time)
        $('.ui_state_highlight:visible').click()
        await sleep(time)
      }
    }
    // 设置客户 End

    // 设置金额 Start
    {
      const $creditCol = $table.find(`.col_credit:eq(${index})`)
      $creditCol.click()
      // const evt = $.Event('keydown', {keyCode: 13})
      $creditCol.find('input').val(item[moneyFieldName]).focus()
      // $creditCol.trigger(evt)
    }
    // 设置金额 End
  }
}
