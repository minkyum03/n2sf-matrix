/* N2SF 보안통제 매트릭스 - 화면 동작 (필터, 검색, 모바일 목차) */
(function () {
  'use strict';

  // ---------- 매트릭스: 등급 필터 (여러 개 선택 가능, 선택한 등급 중 하나라도 해당하면 표시) ----------
  var matrix = document.querySelector('[data-filter-scope="matrix"]');
  if (matrix) {
    var cards = document.querySelectorAll('.mx-card[data-grades]');
    var count = matrix.querySelector('[data-count]');
    var btns = matrix.querySelectorAll('.gbtn');
    var selected = {};   // { C: true, S: true }

    function applyMatrix() {
      var keys = Object.keys(selected);
      var n = 0;
      cards.forEach(function (card) {
        var g = card.dataset.grades;
        var ok = !keys.length || keys.some(function (k) { return g.indexOf(k) !== -1; });
        card.hidden = !ok;
        if (ok) n++;
      });
      count.textContent = n;
      btns.forEach(function (b) {
        var on = b.dataset.grade ? !!selected[b.dataset.grade] : !keys.length;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on);
      });
    }

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var k = btn.dataset.grade;
        if (!k) selected = {};
        else if (selected[k]) delete selected[k];
        else selected[k] = true;
        applyMatrix();
      });
    });
  }

  // ---------- 전체 목록: 검색 + 그룹 + 등급 ----------
  var list = document.querySelector('[data-filter-scope="list"]');
  if (list) {
    var rows = document.querySelectorAll('.list-table tbody tr');
    var search = list.querySelector('[data-search]');
    var groupSel = list.querySelector('[data-group-filter]');
    var lcount = list.querySelector('[data-count]');
    var empty = document.querySelector('[data-empty]');
    var grade = '';

    function applyList() {
      var q = search.value.trim().toLowerCase();
      var g = groupSel.value;
      var n = 0;
      rows.forEach(function (tr) {
        var ok = (!q || tr.dataset.text.indexOf(q) !== -1) &&
                 (!g || tr.dataset.group === g) &&
                 (!grade || tr.dataset.grades.indexOf(grade) !== -1);
        tr.hidden = !ok;
        if (ok) n++;
      });
      lcount.textContent = n;
      empty.hidden = n !== 0;
    }

    search.addEventListener('input', applyList);
    groupSel.addEventListener('change', applyList);
    list.querySelectorAll('.fbtn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        list.querySelectorAll('.fbtn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        grade = btn.dataset.grade;
        applyList();
      });
    });
  }

  // ---------- 모바일 목차 열기/닫기 ----------
  var toggle = document.querySelector('[data-toggle-sidebar]');
  if (toggle) {
    toggle.addEventListener('click', function () { document.body.classList.toggle('sidebar-open'); });
  }

  // ---------- 사이드바: 현재 항목이 보이도록 스크롤 ----------
  var sb = document.querySelector('.sidebar');
  var cur = sb && sb.querySelector('.current');
  if (cur) {
    var off = cur.getBoundingClientRect().top - sb.getBoundingClientRect().top;
    sb.scrollTop = off - sb.clientHeight / 2;
  }
})();
