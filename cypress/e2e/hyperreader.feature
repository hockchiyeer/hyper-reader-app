Feature: HyperReader open-link workspace
  HyperReader helps readers keep open links, diagnose text, build reading trails, and manage sources.

  Background:
    Given I open HyperReader with a clean workspace

  Scenario: Localize the core interface and persist the selected locale
    Then the document language should be "zh-Hans"
    And the interface should show "阅读队列"
    When I switch locale to "zh-Hant"
    Then the document language should be "zh-Hant"
    And the interface should show "閱讀佇列"
    When I switch locale to "en"
    Then the document language should be "en"
    And the interface should show "Reading Queue"
    And the search placeholder should be "Search titles, sources, tags, or link domains"
    When I switch locale to "ms"
    Then the document language should be "ms"
    And the interface should show "Giliran Bacaan"
    When I reload the app
    Then the selected locale should still be "ms"
    And the interface should show "Giliran Bacaan"

  Scenario: Search and filters refine the reading queue
    Then the reading queue should contain at least 7 cards
    When I search for "RSS"
    Then the reading queue should contain exactly 1 card
    And the reading queue should show "RSS 是安静但仍然有效的公共基础设施"
    When I clear the search
    And I filter the queue by "needs-links"
    Then the reading queue should show "内容农场与 AI 馊水的共同弱点"
    And the queue subtitle should mention total items
    When I filter the queue by "saved"
    Then the reading queue should show "开放互联网的灵魂是超级链接"

  Scenario: Reader actions save an item, build a trail, and copy Markdown
    When I open the article "AI 摘要如何制造零点击阅读习惯"
    Then the reader should show "AI 摘要如何制造零点击阅读习惯"
    And the reader should show 5 score rows
    When I save the current reader item
    Then the saved count should be at least 3
    When I build a trail from the reader
    Then the trail should contain 7 steps
    When I copy the trail as Markdown
    Then the clipboard should include "HyperReader 阅读路径"

  Scenario: Diagnose text and copy the diagnosis result
    When I open the "diagnose" view
    And I run diagnosis without input
    Then the toast should show "请先粘贴内容或 URL"
    When I diagnose the sample text
    Then the diagnosis result should show "开放阅读分"
    And the diagnosis result should show "补救动作"
    When I copy the diagnosis
    Then the clipboard should include "开放阅读分"

  Scenario: Add, validate, toggle, and export sources
    When I open the "sources" view
    And I submit an empty source
    Then the toast should show "标题和 URL 不能为空"
    When I add a source titled "Open Knowledge Test"
    Then the reader should show "Open Knowledge Test"
    When I open the "sources" view
    And I pause the source "example.net"
    Then the toast should show "来源已暂停"
    When I export the source library
    Then the exported data should include "Open Knowledge Test"

  Scenario: Navigation exposes every primary workspace
    When I open the "queue" view
    Then the active view should be "queue"
    When I open the "reader" view
    Then the active view should be "reader"
    When I open the "trail" view
    Then the active view should be "trail"
    When I open the "sources" view
    Then the active view should be "sources"

  Scenario: The link graph renders to a non-empty canvas
    When I open the "graph" view
    Then the graph canvas should be drawn
