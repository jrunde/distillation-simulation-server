require 'test_helper'

class GameControllerTest < ActionController::TestCase
  test "should get play" do
    get :play
    assert_response :success
  end

  test "should get global" do
    get :global
    assert_response :success
  end

  test "should get moderator" do
    get :moderator
    assert_response :success
  end

end
